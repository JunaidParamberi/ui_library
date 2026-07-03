// Craftly — Proposal (2 pages: cover + content)
// Page 1: editorial cover. Page 2: scope, timeline, pricing, acceptance.

function ProposalCoverDoc() {
  return (
    <div className="sheet sheet--cover">
      <div className="cover">
        <div className="cover__top">
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <div className="brandmark">L</div>
            <div style={{ fontFamily: "Inter Tight, sans-serif", fontWeight: 600, fontSize: 15, letterSpacing: "-0.012em" }}>
              Studio Marchetti
            </div>
          </div>
          <div className="cover__id">P-0091 · v1</div>
        </div>

        <div className="cover__body">
          <div className="cover__eyebrow">Proposal · Prepared for Maple Co.</div>
          <h1 className="cover__title">
            A seasonal site that <em style={{ fontStyle: "normal", color: "#3550E0" }}>sells the season</em>, not just the products.
          </h1>
          <div className="cover__sub">
            A six-week build for Maple's autumn collection — visual direction,
            editorial site, and a small motion system that carries the campaign
            across email, social and retail.
          </div>

          <div className="cover__meta">
            <div>
              <div className="k">Client</div>
              <div className="v">Maple Co.</div>
            </div>
            <div>
              <div className="k">Project</div>
              <div className="v">Autumn '26 site</div>
            </div>
            <div>
              <div className="k">Investment</div>
              <div className="v">AED 18,600 — 22,400</div>
            </div>
          </div>
        </div>

        <div className="cover__bottom">
          <div className="cover__from">
            <div style={{
              width: 40, height: 40, borderRadius: "50%",
              background: "linear-gradient(135deg, #3550E0, #6E83F0)",
              display: "grid", placeItems: "center", color: "#fff",
              fontWeight: 600, fontSize: 13,
            }}>LM</div>
            <div>
              <div className="name">Lena Marchetti</div>
              <div className="role">Founder &amp; design lead · Studio Marchetti</div>
            </div>
          </div>
          <div style={{ textAlign: "right", fontSize: 11, color: "#898E96", fontFamily: "JetBrains Mono, monospace" }}>
            Issued 16 May 2026<br />
            Valid 30 days
          </div>
        </div>
      </div>
    </div>
  );
}

function ProposalContentDoc() {
  return (
    <div className="sheet">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 16, marginBottom: 28, borderBottom: "1px solid #ECECE7", fontSize: 11, color: "#898E96", letterSpacing: "0.08em", textTransform: "uppercase" }}>
        <span>Proposal P-0091 · Maple Co. — Autumn '26 site</span>
        <span>Page 2 of 2</span>
      </div>

      <div className="section">
        <div className="section__title">
          <span className="section__num">01</span>
          <span>The opportunity</span>
        </div>
        <p className="lede">
          Maple's autumn collection is the strongest in three years, but last
          year's site treated it like a product grid. We have a six-week window
          to land a site that feels like the season — warm, tactile, and
          unmistakably Maple.
        </p>
        <p>
          The work below is sized to ship by 02 September, two weeks before the
          collection drops on 16 September. We've left a buffer week for
          retail-team feedback and a soft-launch to your VIP list.
        </p>
      </div>

      <div className="section">
        <div className="section__title">
          <span className="section__num">02</span>
          <span>What we'll deliver</span>
        </div>
        <div className="deliverables">
          <div className="row">
            <div className="num">01</div>
            <div>
              <div className="name">Visual direction &amp; moodwork</div>
              <div className="desc">Two routes, hero comp + type / color / texture system per route. One route chosen and refined.</div>
            </div>
            <div className="hrs">24h</div>
          </div>
          <div className="row">
            <div className="num">02</div>
            <div>
              <div className="name">Editorial homepage &amp; collection page</div>
              <div className="desc">Long-form, mixed media, 9 sections. Designed at 3 breakpoints with motion specs.</div>
            </div>
            <div className="hrs">48h</div>
          </div>
          <div className="row">
            <div className="num">03</div>
            <div>
              <div className="name">Lookbook module — 12 products</div>
              <div className="desc">Reusable layout block, headless-CMS schema, image guidelines for your studio.</div>
            </div>
            <div className="hrs">22h</div>
          </div>
          <div className="row">
            <div className="num">04</div>
            <div>
              <div className="name">Motion system — 6 primitives</div>
              <div className="desc">Reveal, parallax, ribbon, hover-tint, marquee, page transition. Documented in Figma + code.</div>
            </div>
            <div className="hrs">16h</div>
          </div>
          <div className="row">
            <div className="num">05</div>
            <div>
              <div className="name">Build &amp; deploy (Next.js + Sanity)</div>
              <div className="desc">Headless CMS, Vercel deploy, analytics, sub-2s LCP on 3G.</div>
            </div>
            <div className="hrs">52h</div>
          </div>
          <div className="row">
            <div className="num">06</div>
            <div>
              <div className="name">Soft launch &amp; campaign handoff</div>
              <div className="desc">QA on real devices, retail-team walkthrough, two-week post-launch support.</div>
            </div>
            <div className="hrs">14h</div>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="section__title">
          <span className="section__num">03</span>
          <span>Timeline</span>
        </div>
        <div className="timeline">
          <div className="timeline__week-head">
            <div></div>
            <div className="wk">W1</div><div className="wk">W2</div><div className="wk">W3</div><div className="wk">W4</div>
            <div className="wk">W5</div><div className="wk">W6</div><div className="wk">W7</div><div className="wk">W8</div>
          </div>
          <div className="timeline__row">
            <div className="timeline__phase">Direction</div>
            <div className="timeline__bar timeline__bar--accent" style={{ gridColumn: "2 / span 2" }} />
          </div>
          <div className="timeline__row">
            <div className="timeline__phase">Design</div>
            <div className="timeline__bar" style={{ gridColumn: "3 / span 3" }} />
          </div>
          <div className="timeline__row">
            <div className="timeline__phase">Build</div>
            <div className="timeline__bar timeline__bar--soft" style={{ gridColumn: "4 / span 4" }} />
          </div>
          <div className="timeline__row">
            <div className="timeline__phase">Soft launch</div>
            <div className="timeline__bar timeline__bar--accent" style={{ gridColumn: "8 / span 1" }} />
          </div>
          <div className="timeline__row">
            <div className="timeline__phase">Buffer / VIP preview</div>
            <div className="timeline__bar timeline__bar--ghost" style={{ gridColumn: "9 / span 1" }} />
          </div>
        </div>
        <div style={{ marginTop: 14, fontSize: 11.5, color: "#898E96", display: "flex", gap: 16 }}>
          <span>Kickoff · 23 June</span>
          <span>·</span>
          <span>Soft launch · 26 August</span>
          <span>·</span>
          <span>Public launch · 16 September</span>
        </div>
      </div>

      <div className="section">
        <div className="section__title">
          <span className="section__num">04</span>
          <span>Investment</span>
        </div>
        <table className="items">
          <thead>
            <tr>
              <th>Phase</th>
              <th className="r">Hours</th>
              <th className="r">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            <tr><td><div className="desc-title">Direction &amp; design</div></td><td className="qty">72</td><td className="total">8,640.00</td></tr>
            <tr><td><div className="desc-title">Build &amp; deploy</div></td><td className="qty">52</td><td className="total">6,240.00</td></tr>
            <tr><td><div className="desc-title">Motion system</div></td><td className="qty">16</td><td className="total">1,920.00</td></tr>
            <tr><td><div className="desc-title">Launch &amp; support</div></td><td className="qty">14</td><td className="total">1,680.00</td></tr>
          </tbody>
        </table>
        <div className="totals">
          <div className="totals__inner">
            <div className="row"><span className="dim">Subtotal</span><span className="tabular">18,480.00</span></div>
            <div className="row"><span className="dim">Contingency (≤20%)</span><span className="tabular">up to 3,696.00</span></div>
            <div className="row grand"><span>Range AED</span><span className="tabular">18.5k — 22.2k</span></div>
          </div>
        </div>
      </div>

      <div className="section" style={{ marginBottom: 12 }}>
        <div className="section__title">
          <span className="section__num">05</span>
          <span>Next step</span>
        </div>
        <p>
          Sign below and we'll send a kickoff agenda within 24 hours. The 50%
          deposit invoice goes out the same day; we hold the slot once it's
          received.
        </p>
        <div className="signatures">
          <div>
            <div className="signature__label">For Studio Marchetti</div>
            <div className="signature__line signed" />
            <div className="signature__name">Lena Marchetti — Founder</div>
            <div className="signature__date">16 May 2026</div>
          </div>
          <div>
            <div className="signature__label">For Maple Co.</div>
            <div className="signature__line" />
            <div className="signature__name">Sara Berger — Brand Director</div>
            <div className="signature__date">__ / __ / 2026</div>
          </div>
        </div>
      </div>
    </div>
  );
}

window.ProposalCoverDoc = ProposalCoverDoc;
window.ProposalContentDoc = ProposalContentDoc;
