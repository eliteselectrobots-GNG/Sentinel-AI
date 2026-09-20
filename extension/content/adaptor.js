(() => {
  "use strict";

  globalThis.SentAIAdaptor = (() => {
    function cleanField(value) {
      return String(value || "")
        .replace(/[\u0000-\u001f\u007f]+/g, " ")
        .replace(/\s{2,}/g, " ")
        .trim();
    }

    function buildPseudoRaw(ext) {
      const lines = [];
      let from;
      if (ext.senderEmail && /@/.test(ext.senderEmail)) {
        from = ext.senderName && ext.senderName !== ext.senderEmail ? `${ext.senderName} <${ext.senderEmail}>` : `<${ext.senderEmail}>`;
      } else if (ext.senderName) {
        from = ext.senderName;
      } else {
        from = "Unknown sender";
      }
      lines.push(`From: ${cleanField(from)}`);
      if (ext.replyTo && /@/.test(ext.replyTo)) lines.push(`Reply-To: ${cleanField(ext.replyTo)}`);
      lines.push(`Subject: ${cleanField(ext.subject) || "Untitled message"}`);
      lines.push(`Date: ${cleanField(ext.dateText) || new Date().toUTCString()}`);

      if (ext.links && ext.links.length > 0) {
        const anchors = ext.links
          .filter((l) => l.href)
          .map((l) => {
            const href = cleanField(l.href).replace(/"/g, "&quot;");
            const text = cleanField(l.text) || href;
            return `<a href="${href}">${text}</a>`;
          });
        lines.push(`X-Sentinel-Links: ${anchors.join(" ")}`);
      }

      if (ext.attachments && ext.attachments.length > 0) {
        const names = ext.attachments.map((n) => `filename="${cleanField(n)}"`).join(" ");
        lines.push(`X-Sentinel-Attachments: ${names}`);
      }

      const body = cleanField(ext.bodyText) || "(no message body extracted)";
      return lines.join("\n") + "\n\n" + body;
    }

    async function scan(ext) {
      const D = globalThis.SentAIDetection;
      if (!D || typeof D.scanEmail !== "function") throw new Error("detection engine unavailable");
      const raw = buildPseudoRaw(ext);
      const result = await D.scanEmail(raw);
      const stored = D.toStoredScan(raw, result);
      stored.extract = {
        provider: ext.provider || (globalThis.SentAIProviders && globalThis.SentAIProviders.detectProvider()) || "generic",
        senderName: cleanField(ext.senderName),
        linksCount: (ext.links || []).length,
        attachments: (ext.attachments || []).length,
      };
      const classification = D.classifyEmail(stored, [], "");
      const attribution = D.attributionOf(stored, [], "");
      const priority = D.priorityOf(stored, []);
      const briefing = D.buildBriefing(stored, [], "");
      const iocs = D.extractIocs(raw, result);
      const domainAnalysis = D.analyzeIocs(iocs, [], "");
      return { raw, result, stored, classification, attribution, priority, briefing, iocs, domainAnalysis };
    }

    async function prescan(subject, sender, senderEmail, snippet) {
      const D = globalThis.SentAIDetection;
      if (!D || typeof D.scanEmail !== "function") return null;
      const raw = `From: ${cleanField(senderEmail) || cleanField(sender) || "Unknown\n"}\nSubject: ${cleanField(subject) || "(no subject)"}\n\n${cleanField(snippet)}`;
      try {
        const result = await D.scanEmail(raw);
        const stored = D.toStoredScan(raw, result);
        const cls = D.classifyEmail(stored, [], "");
        // Headerless preview: the full scan adds +8 when no Received headers
        // exist, which unfairly taxes every list row. Waive it here.
        const hasRelay = (result.findings || []).some((f) => f.label === "Relay path reconstructed");
        const score = Math.max(0, result.riskScore - (hasRelay ? 0 : 8));
        return {
          score,
          riskLabel: score >= 75 ? "Critical" : score >= 55 ? "High" : score >= 30 ? "Medium" : "Low",
          className: cls.className,
          confidence: cls.confidence,
          drivers: (cls.evidence || []).filter((f) => f.severity !== "info").slice(0, 3).map((f) => f.label),
          subject: cleanField(subject) || "",
          sender: cleanField(senderEmail) || cleanField(sender) || "",
          senderEmail: cleanField(senderEmail) || "",
        };
      } catch {
        return null;
      }
    }

    return { buildPseudoRaw, scan, prescan };
  })();
})();