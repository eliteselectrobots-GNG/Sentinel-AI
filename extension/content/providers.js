(() => {
  "use strict";

  globalThis.SentAIProviders = (() => {
    function clean(value) {
      return String(value || "")
        .replace(/\r?\n+/g, " ")
        .replace(/\s{2,}/g, " ")
        .trim();
    }

    function textOf(el) {
      if (!el) return "";
      try {
        return clean(el.innerText || el.textContent || "");
      } catch {
        return clean(el.textContent || "");
      }
    }

    function firstVisible(elements) {
      for (const el of elements) {
        if (!el) continue;
        if (el.offsetParent !== null || el.getClientRects().length > 0) return el;
      }
      return null;
    }

    function linksOf(container) {
      const out = [];
      if (!container) return out;
      for (const a of container.querySelectorAll("a[href]")) {
        let href = (a.getAttribute("href") || "").trim();
        if (!href) continue;
        if (/^\s*(mailto:|tel:|#|javascript:)/i.test(href)) continue;
        if (href.startsWith("{") || href.startsWith("https://www.google.com/url?")) continue;
        const text = textOf(a).slice(0, 200);
        out.push({ href, text });
      }
      return out;
    }

    const GMAIL = {
      extractOpen() {
        const main = document.querySelector('div[role="main"]') || document.body;
        const subjectEl = firstVisible(
          Array.from(document.querySelectorAll('h2.hP, h2[data-identifytitle], h1[data-identifytitle], [role="main"] h2, [role="main"] h1'))
        );
        const subject = subjectEl ? textOf(subjectEl) : "";

        let senderName = "";
        let senderEmail = "";
        const fromLine = document.querySelector('[role="main"] .gD, [role="main"] .gE, [role="main"] span[email]');
        const fromLink = document.querySelector('[role="main"] a[href^="mailto:"]');
        if (fromLine) {
          senderName = fromLine.getAttribute("name") || fromLine.textContent || "";
          senderEmail = fromLine.getAttribute("email") || "";
        }
        if (!senderEmail && fromLink) {
          const href = fromLink.getAttribute("href") || "";
          senderEmail = href.replace(/^mailto:/i, "").split("?")[0].trim();
          if (!senderName) senderName = textOf(fromLink);
        }
        if (!senderEmail) {
          const span = document.querySelector('[role="main"] [email]');
          if (span) {
            senderEmail = span.getAttribute("email") || "";
            if (!senderName) senderName = span.getAttribute("name") || "";
          }
        }

        const bodyEl = firstVisible(Array.from(document.querySelectorAll('[role="main"] div.a3s, [role="main"] div[class*="a3s"]')));
        const bannerAnchor = bodyEl || main;
        const bodyText = bodyEl ? textOf(bodyEl) : textOf(main);
        const links = linksOf(bodyEl || main);

        const attachments = [];
        const seenAtt = new Set();
        for (const el of main.querySelectorAll('[download], a[aria-label*="Download"], a[aria-label*="attachment"], [data-tooltip*="Download"]')) {
          const name = (el.getAttribute("download") || el.getAttribute("aria-label") || el.getAttribute("data-tooltip") || "")
            .trim()
            .replace(/^download\s/i, "")
            .replace(/^attachment\s/i, "");
          if (name && !seenAtt.has(name.toLowerCase())) {
            seenAtt.add(name.toLowerCase());
            attachments.push(name);
          }
        }

        let dateText = "";
        const dateEl = document.querySelector('[role="main"] span[data-tooltip], [role="main"] [data-tooltip], [role="main"] td[nowrap]');
        if (dateEl) {
          dateText = clean(dateEl.getAttribute("data-tooltip") || dateEl.textContent || "");
          if (!/AM|PM|,|UTC|\+\d{4}/i.test(dateText) && dateText.length > 0 && /^\d+$/.test(dateText.replace(/[:]/g, ""))) {
            dateText = clean(dateEl.textContent || "");
          }
        }
        if (!dateText) dateText = new Date().toUTCString();

        return {
          provider: "gmail",
          subject,
          senderName,
          senderEmail,
          dateText,
          replyTo: "",
          bodyText,
          links,
          attachments,
          bannerAnchor,
        };
      },

      listRows() {
        const rows = [];
        const candidates = document.querySelectorAll(
          '[role="main"] table tr.zA, [role="main"] table tr[class*="zA"], [role="main"] tr[tabindex][data-tooltip], [role="main"] div.zA, [role="main"] div[class*="zA"][role="row"]'
        );
        for (const tr of candidates) {
          if (!(tr.offsetParent !== null || tr.getClientRects().length > 0)) continue;
          const subjectEl = tr.querySelector(".xT, .bog, [class*='xT']");
          const fromEl = tr.querySelector(".yP, [email]");
          const snipEl = tr.querySelector(".y2, [class*='y2']");
          const fromName = fromEl ? fromEl.getAttribute("name") || fromEl.getAttribute("title") || textOf(fromEl) : "";
          const fromEmail = fromEl ? fromEl.getAttribute("email") || "" : "";
          const subject = subjectEl ? textOf(subjectEl) : "";
          const snippet = snipEl ? textOf(snipEl) : "";
          rows.push({ rowEl: tr, sender: fromName || fromEmail, senderEmail: fromEmail, subject, snippet });
        }
        return rows;
      },

      actionDelete() {
        const buttons = Array.from(document.querySelectorAll('[role="main"] div[role="button"], [role="main"] [role="button"]'));
        const trash = buttons.find(
          (el) =>
            /^delete$/i.test(el.getAttribute("data-tooltip") || "") ||
            /^delete\b/i.test(el.getAttribute("aria-label") || "") ||
            /^delete\b/i.test(el.getAttribute("title") || "")
        );
        if (trash) {
          trash.click();
          return true;
        }
        const toolbar = document.querySelector('[role="main"] [role="toolbar"]');
        if (toolbar) {
          const btn = Array.from(toolbar.querySelectorAll("div[role='button'], [role='button']")).find(
            (el) => /delete/i.test(el.getAttribute("data-tooltip") || "") || /delete/i.test(el.getAttribute("aria-label") || "")
          );
          if (btn) {
            btn.click();
            return true;
          }
        }
        return false;
      },
    };

    const OUTLOOK = {
      extractOpen() {
        const bodyEl = firstVisible(
          Array.from(document.querySelectorAll('[data-testid="message-view-body-content"], [data-testid="message-body"], [role="main"] [role="document"], .rps_90b8'))
        );
        const main = document.querySelector('[role="main"]') || document.body;
        const subjectEl = firstVisible(
          Array.from(document.querySelectorAll('[data-testid="message-header-subject"], [data-testid="message-subject"], [role="main"] h2, [role="main"] h1'))
        );
        const subject = subjectEl ? textOf(subjectEl) : "";

        let senderName = "";
        let senderEmail = "";
        const senderEl = firstVisible(
          Array.from(document.querySelectorAll('[data-testid="conversationHeader-sender"], [data-testid="message-sender"], [data-testid="conversation-header-sender"]'))
        );
        if (senderEl) senderName = textOf(senderEl);
        const fromLink = senderEl ? senderEl.querySelector('a[href^="mailto:"]') : null;
        if (fromLink) {
          senderEmail = (fromLink.getAttribute("href") || "").replace(/^mailto:/i, "").split("?")[0].trim();
          if (!senderName) senderName = textOf(fromLink);
        }

        const bannerAnchor = bodyEl || main;
        const bodyText = bodyEl ? textOf(bodyEl) : textOf(main);
        const links = linksOf(bodyEl || main);

        const attachments = [];
        const seenAtt = new Set();
        for (const el of main.querySelectorAll('[data-testid*="attachment"] [aria-label], a[download], [aria-label*="attachment"]')) {
          const name = (el.getAttribute("download") || el.getAttribute("aria-label") || "").trim();
          if (name && !seenAtt.has(name.toLowerCase())) {
            seenAtt.add(name.toLowerCase());
            attachments.push(name.replace(/^download\s/i, ""));
          }
        }

        const dateEl = document.querySelector('[data-testid="message-time"], [data-testid="message-header-details"] time, [role="main"] time');
        const dateText = dateEl ? clean(dateEl.getAttribute("title") || dateEl.textContent || "") || new Date().toUTCString() : new Date().toUTCString();

        return {
          provider: "outlook",
          subject,
          senderName,
          senderEmail,
          dateText,
          replyTo: "",
          bodyText,
          links,
          attachments,
          bannerAnchor,
        };
      },

      listRows() {
        const rows = [];
        const candidates = document.querySelectorAll(
          '[role="main"] [role="option"], [role="main"] [data-testid*="message-list"] [role="option"], [role="row"]'
        );
        for (const el of candidates) {
          if (!(el.offsetParent !== null || el.getClientRects().length > 0)) continue;
          const subjectEl = el.querySelector('[data-testid*="subject"], h3, h2');
          const senderEl = el.querySelector('[data-testid*="from"], [data-testid*="sender"], [title*="@"]');
          const subject = subjectEl ? textOf(subjectEl) : "";
          const sender = senderEl ? textOf(senderEl) : "";
          rows.push({ rowEl: el, sender, senderEmail: "", subject, snippet: textOf(el).slice(0, 140) });
        }
        return rows;
      },

      actionDelete() {
        const selectors = ['[data-testid="toolbar-delete"]', '[data-testid="deleteButton"]', '[aria-label="Delete"]', '[title="Delete"]'];
        for (const sel of selectors) {
          const btn = document.querySelector(sel);
          if (btn) {
            btn.click();
            return true;
          }
        }
        return false;
      },
    };

    const YAHOO = {
      extractOpen() {
        const bodyEl = firstVisible(
          Array.from(document.querySelectorAll('[data-test-id="message-body"], .ymail-body-content, [data-testid="message-body"], .msg-body'))
        );
        const main = document.querySelector('[role="main"]') || document.querySelector(".mail-content") || document.body;
        const subjectEl = firstVisible(
          Array.from(document.querySelectorAll('[data-test-id="message-subject"], .subject, [role="main"] h2, [role="main"] h1'))
        );
        const subject = subjectEl ? textOf(subjectEl) : "";

        let senderName = "";
        let senderEmail = "";
        const senderEl = firstVisible(
          Array.from(document.querySelectorAll('[data-test-id="message-from"], [data-test-id="sender"], .from, [aria-label*="From"]'))
        );
        if (senderEl) {
          senderName = textOf(senderEl);
          const link = senderEl.querySelector('a[href^="mailto:"]');
          if (link) senderEmail = (link.getAttribute("href") || "").replace(/^mailto:/i, "").split("?")[0].trim();
        }

        const bannerAnchor = bodyEl || main;
        const bodyText = bodyEl ? textOf(bodyEl) : textOf(main);
        const links = linksOf(bodyEl || main);

        const attachments = [];
        for (const el of main.querySelectorAll('a[href*="/ws/v1/attachments"], a[href*="download"], [aria-label*="attachment"]')) {
          const name = (el.getAttribute("aria-label") || el.textContent || "").trim();
          if (name) attachments.push(name);
        }

        const dateEl = document.querySelector("[data-test-id='message-date'], .date");
        const dateText = dateEl ? clean(dateEl.textContent || dateEl.getAttribute("title") || "") || new Date().toUTCString() : new Date().toUTCString();

        return {
          provider: "yahoo",
          subject,
          senderName,
          senderEmail,
          dateText,
          replyTo: "",
          bodyText,
          links,
          attachments,
          bannerAnchor,
        };
      },

      listRows() {
        const rows = [];
        const candidates = document.querySelectorAll('[data-test-id="virtual-list"] [data-test-id="message-list-item"], .msg-container, li[data-test-id^="message"]');
        for (const el of candidates) {
          if (!(el.offsetParent !== null || el.getClientRects().length > 0)) continue;
          const subjectEl = el.querySelector('[data-test-id="subject"], .subject');
          const senderEl = el.querySelector('[data-test-id="from"], .from, [title*="@"]');
          const subject = subjectEl ? textOf(subjectEl) : "";
          const sender = senderEl ? textOf(senderEl) : "";
          rows.push({ rowEl: el, sender, senderEmail: "", subject, snippet: textOf(el).slice(0, 140) });
        }
        return rows;
      },

      actionDelete() {
        const selectors = ['[data-test-id="delete-button"]', '[data-test-id="toolbar-delete"]', '[aria-label="Delete"]', '[title="Delete"]'];
        for (const sel of selectors) {
          const btn = document.querySelector(sel);
          if (btn) {
            btn.click();
            return true;
          }
        }
        return false;
      },
    };

    const GENERIC = {
      extractOpen() {
        const main = document.querySelector("main, [role='main'], article, .content-area") || document.body;
        const subjectEl = firstVisible(Array.from(document.querySelectorAll("main h1, main h2, [role='main'] h2, [role='main'] h1, article h1, article h2")));
        const subject = subjectEl ? textOf(subjectEl) : "";

        let senderName = "";
        let senderEmail = "";
        const fromLink = main.querySelector('a[href^="mailto:"]') || document.body.querySelector('a[href^="mailto:"]');
        if (fromLink) {
          senderEmail = (fromLink.getAttribute("href") || "").replace(/^mailto:/i, "").split("?")[0].trim();
          senderName = textOf(fromLink) || senderEmail;
        }

        const bannerAnchor = main;
        const bodyText = textOf(main);
        const links = linksOf(main);

        const attachments = [];
        for (const el of main.querySelectorAll('a[download], a[href*="download"]')) {
          const name = (el.getAttribute("download") || el.textContent || "").trim();
          if (name) attachments.push(name);
        }

        return {
          provider: "generic",
          subject,
          senderName,
          senderEmail,
          dateText: new Date().toUTCString(),
          replyTo: "",
          bodyText,
          links,
          attachments,
          bannerAnchor,
        };
      },

      listRows() {
        const rows = [];
        const candidates = document.querySelectorAll('[role="main"] [role="option"], [role="main"] li, [role="main"] article, tr[tabindex]');
        for (const el of Array.from(candidates).slice(0, 200)) {
          if (!(el.offsetParent !== null || el.getClientRects().length > 0)) continue;
          const subjectEl = el.querySelector("h1, h2, h3, [class*='subject'], [class*='Subject']");
          const senderEl = el.querySelector("a[href^='mailto:'], [class*='from'], [class*='sender'], [title*='@']");
          const subject = subjectEl ? textOf(subjectEl) : "";
          const sender = senderEl ? textOf(senderEl) : "";
          if (!subject && !sender) continue;
          rows.push({ rowEl: el, sender, senderEmail: "", subject, snippet: textOf(el).slice(0, 140) });
        }
        return rows;
      },

      actionDelete() {
        const selectors = ['[aria-label="Delete"]', '[title="Delete"]', '[data-testid*="delete"]'];
        for (const sel of selectors) {
          const btn = document.querySelector(sel);
          if (btn) {
            btn.click();
            return true;
          }
        }
        return false;
      },
    };

    function detectProvider() {
      const host = location.hostname.replace(/^www\./, "");
      if (host === "mail.google.com") return "gmail";
      if (host === "outlook.live.com" || host === "outlook.com" || host.endsWith(".outlook.com")) return "outlook";
      if (host === "mail.yahoo.com" || host.endsWith(".mail.yahoo.com")) return "yahoo";
      return "generic";
    }

    const registry = { gmail: GMAIL, outlook: OUTLOOK, yahoo: YAHOO, generic: GENERIC };

    return {
      detectProvider,
      provider() {
        const name = detectProvider();
        return Object.assign({ name }, registry[name]);
      },
    };
  })();
})();