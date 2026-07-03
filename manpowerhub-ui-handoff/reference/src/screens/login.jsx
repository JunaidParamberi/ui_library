// ManpowerHub — Auth & Onboarding
const { useState: useStateL } = React;

/* ── eye-off icon ── */
const IconEyeOff = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20C5 20 1 12 1 12a18.45 18.45 0 0 1 5.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
    <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

/* ── password field ── */
function PwField({ label, hint, onHint, placeholder }) {
  const [show, setShow] = useStateL(false);
  return (
    <div className="field">
      {(label || hint) && (
        <div style={{ display:"flex", justifyContent:"space-between" }}>
          {label && <label className="field__label">{label}</label>}
          {hint  && <a className="field__label" style={{ color:"var(--accent)", cursor:"pointer" }} onClick={onHint}>{hint}</a>}
        </div>
      )}
      <div style={{ position:"relative" }}>
        <input className="input input--lg" type={show?"text":"password"} placeholder={placeholder||"••••••••"}
          style={{ width:"100%", paddingRight:40, boxSizing:"border-box" }} />
        <button type="button" onClick={()=>setShow(v=>!v)} style={{
          position:"absolute", right:12, top:"50%", transform:"translateY(-50%)",
          background:"none", border:"none", cursor:"pointer", color:"var(--fg-3)", padding:0, display:"flex", alignItems:"center"
        }}>
          {show ? <IconEyeOff /> : <Icon.Eye size={14} />}
        </button>
      </div>
    </div>
  );
}

/* ── google button ── */
const GoogleBtn = () => (
  <button className="btn btn--secondary btn--lg" style={{ width:"100%", justifyContent:"center" }}>
    <svg width="14" height="14" viewBox="0 0 24 24" style={{ flexShrink:0 }}>
      <path d="M21.35 11.1H12v2.94h5.34c-.23 1.26-.94 2.33-2 3.05v2.53h3.24c1.9-1.74 3-4.31 3-7.36 0-.69-.06-1.36-.18-2z" fill="#4285F4"/>
      <path d="M12 22c2.7 0 4.96-.89 6.62-2.42l-3.24-2.53c-.9.6-2.05.96-3.38.96-2.6 0-4.8-1.76-5.58-4.12H3.07v2.6A10 10 0 0 0 12 22z" fill="#34A853"/>
      <path d="M6.42 13.89A6 6 0 0 1 6.08 12c0-.66.12-1.3.34-1.89V7.5H3.07A10 10 0 0 0 2 12c0 1.61.38 3.13 1.07 4.5l3.35-2.61z" fill="#FBBC05"/>
      <path d="M12 5.95c1.47 0 2.78.5 3.82 1.5l2.86-2.85C16.95 3.04 14.7 2 12 2 8.07 2 4.25 3.04 3.07 7.5l3.35 2.61C7.2 7.7 9.4 5.95 12 5.95z" fill="#EA4335"/>
    </svg>
    Continue with Google
  </button>
);

const OrDivider = () => (
  <div style={{ display:"flex", alignItems:"center", gap:12, color:"var(--fg-3)", fontSize:12 }}>
    <div style={{ flex:1, height:1, background:"var(--border)" }}/><span>or with email</span><div style={{ flex:1, height:1, background:"var(--border)" }}/>
  </div>
);

const Opt = () => <span style={{ color:"var(--fg-3)", fontWeight:400 }}> (optional)</span>;

/* ══════════════════ AUTH FORMS ══════════════════ */

function LoginForm({ goTo, goto }) {
  const [mode, setMode] = useStateL("password");
  return (
    <div>
      <h1 style={{ fontFamily:"var(--font-display)", fontSize:30, fontWeight:600, letterSpacing:"-0.025em", marginBottom:8 }}>Welcome back</h1>
      <p style={{ color:"var(--fg-2)", fontSize:14, marginBottom:24 }}>
        Sign in to continue. <a style={{ color:"var(--accent)", fontWeight:500, cursor:"pointer" }} onClick={()=>goTo("signup")}>Create an account</a>
      </p>
      <div style={{ display:"grid", gap:14 }}>
        <GoogleBtn />
        <OrDivider />
        <div style={{ display:"flex", gap:3, background:"var(--bg-subtle)", borderRadius:8, padding:3 }}>
          {[["password","Password"],["magic","Magic link"]].map(([m,l])=>(
            <button key={m} onClick={()=>setMode(m)} style={{
              flex:1, padding:"6px 0", borderRadius:6, border:"none", cursor:"pointer", fontSize:12, fontWeight:500,
              background: mode===m ? "var(--bg-surface)" : "transparent",
              color: mode===m ? "var(--fg)" : "var(--fg-3)",
              boxShadow: mode===m ? "var(--shadow-sm)" : "none",
              transition:"all var(--dur-fast)"
            }}>{l}</button>
          ))}
        </div>
        <div className="field">
          <label className="field__label">Email</label>
          <input className="input input--lg" type="email" placeholder="you@manpowerhub.ae" defaultValue="junaid@manpowerhub.ae" />
        </div>
        {mode==="password" && <PwField label="Password" hint="Forgot?" onHint={()=>goTo("forgot")} />}
        <button className="btn btn--primary btn--lg" style={{ justifyContent:"center", marginTop:2 }} onClick={()=>goTo("onboard")}>
          {mode==="password" ? <><span>Sign in</span><Icon.ArrowRight size={14}/></> : <><span>Send magic link</span><Icon.Mail size={14}/></>}
        </button>
        <div style={{ textAlign:"center", fontSize:12 }} className="dim">
          New here? <a style={{ color:"var(--accent)", fontWeight:500, cursor:"pointer" }} onClick={()=>goTo("signup")}>Create a free account</a>
        </div>
      </div>
    </div>
  );
}

function SignUpForm({ goTo }) {
  const [done, setDone] = useStateL(false);
  if (done) return (
    <div style={{ textAlign:"center", padding:"32px 0" }}>
      <div style={{ width:52, height:52, borderRadius:"50%", background:"var(--bg-subtle)", border:"1px solid var(--border)", display:"grid", placeItems:"center", margin:"0 auto 18px" }}>
        <Icon.Mail size={22} style={{ color:"var(--accent)" }}/>
      </div>
      <h2 style={{ fontFamily:"var(--font-display)", fontSize:24, fontWeight:600, letterSpacing:"-0.02em", marginBottom:10 }}>Check your email</h2>
      <p style={{ color:"var(--fg-2)", fontSize:14, lineHeight:1.65 }}>We've sent a confirmation link. Click it to activate your account.</p>
      <button className="btn btn--ghost btn--sm" onClick={()=>goTo("login")} style={{ marginTop:20 }}><Icon.ChevronLeft size={12}/>Back to sign in</button>
    </div>
  );
  return (
    <div>
      <h1 style={{ fontFamily:"var(--font-display)", fontSize:30, fontWeight:600, letterSpacing:"-0.025em", marginBottom:8 }}>Create an account</h1>
      <p style={{ color:"var(--fg-2)", fontSize:14, marginBottom:24 }}>
        Already have one? <a style={{ color:"var(--accent)", fontWeight:500, cursor:"pointer" }} onClick={()=>goTo("login")}>Sign in</a>
      </p>
      <div style={{ display:"grid", gap:14 }}>
        <GoogleBtn />
        <OrDivider />
        <div className="field"><label className="field__label">Email</label><input className="input input--lg" type="email" placeholder="you@manpowerhub.ae"/></div>
        <PwField label="Password"/>
        <PwField label="Repeat password"/>
        <button className="btn btn--primary btn--lg" style={{ justifyContent:"center" }} onClick={()=>goTo("onboard")}>
          Create account <Icon.ArrowRight size={14}/>
        </button>
      </div>
    </div>
  );
}

function ForgotForm({ goTo }) {
  const [sent, setSent] = useStateL(false);
  if (sent) return (
    <div style={{ textAlign:"center", padding:"32px 0" }}>
      <div style={{ width:52, height:52, borderRadius:"50%", background:"var(--bg-subtle)", border:"1px solid var(--border)", display:"grid", placeItems:"center", margin:"0 auto 18px" }}>
        <Icon.Mail size={22} style={{ color:"var(--accent)" }}/>
      </div>
      <h2 style={{ fontFamily:"var(--font-display)", fontSize:24, fontWeight:600, letterSpacing:"-0.02em", marginBottom:10 }}>Email sent</h2>
      <p style={{ color:"var(--fg-2)", fontSize:14, lineHeight:1.65 }}>If that address is in our system, you'll get a reset link shortly.</p>
      <button className="btn btn--ghost btn--sm" onClick={()=>goTo("login")} style={{ marginTop:20 }}><Icon.ChevronLeft size={12}/>Back to sign in</button>
    </div>
  );
  return (
    <div>
      <button className="btn btn--ghost btn--sm" onClick={()=>goTo("login")} style={{ marginBottom:18 }}><Icon.ChevronLeft size={12}/>Back</button>
      <h1 style={{ fontFamily:"var(--font-display)", fontSize:30, fontWeight:600, letterSpacing:"-0.025em", marginBottom:8 }}>Reset password</h1>
      <p style={{ color:"var(--fg-2)", fontSize:14, marginBottom:22 }}>Enter your email and we'll send a reset link.</p>
      <div style={{ display:"grid", gap:14 }}>
        <div className="field"><label className="field__label">Email</label><input className="input input--lg" type="email" placeholder="you@manpowerhub.ae"/></div>
        <button className="btn btn--primary btn--lg" style={{ justifyContent:"center" }} onClick={()=>setSent(true)}>Send reset link <Icon.ArrowRight size={14}/></button>
      </div>
    </div>
  );
}

function UpdatePwForm({ goTo }) {
  return (
    <div>
      <h1 style={{ fontFamily:"var(--font-display)", fontSize:30, fontWeight:600, letterSpacing:"-0.025em", marginBottom:8 }}>New password</h1>
      <p style={{ color:"var(--fg-2)", fontSize:14, marginBottom:22 }}>Choose a new password for your account.</p>
      <div style={{ display:"grid", gap:14 }}>
        <PwField label="New password"/>
        <button className="btn btn--primary btn--lg" style={{ justifyContent:"center" }} onClick={()=>goTo("onboard")}>Update password <Icon.ArrowRight size={14}/></button>
      </div>
    </div>
  );
}

/* ══════════════════ ONBOARDING ══════════════════ */
const COUNTRIES = [
  { code:"AE", name:"United Arab Emirates", region:"Emirate",  currency:"AED", regions:["Abu Dhabi","Dubai","Sharjah","Ajman","Umm Al Quwain","Ras Al Khaimah","Fujairah"] },
  { code:"GB", name:"United Kingdom",        region:"County",   currency:"GBP", regions:["England","Scotland","Wales","Northern Ireland"] },
  { code:"US", name:"United States",         region:"State",    currency:"USD", regions:["Alabama","Alaska","Arizona","California","Florida","New York","Texas","Washington"] },
  { code:"IN", name:"India",                 region:"State",    currency:"INR", regions:["Delhi","Maharashtra","Karnataka","Tamil Nadu","Telangana","Gujarat","Rajasthan","West Bengal"] },
  { code:"CA", name:"Canada",                region:"Province", currency:"CAD", regions:["Alberta","British Columbia","Ontario","Quebec"] },
  { code:"AU", name:"Australia",             region:"State",    currency:"AUD", regions:["NSW","VIC","QLD","WA","SA","TAS"] },
  { code:"DE", name:"Germany",               region:"State",    currency:"EUR", regions:[] },
  { code:"FR", name:"France",                region:"Region",   currency:"EUR", regions:[] },
  { code:"SG", name:"Singapore",             region:"Region",   currency:"SGD", regions:[] },
];

/* ── connected step bar ── */
function StepBar({ step }) {
  const steps = ["Your profile","Brand kit","First client"];
  return (
    <div style={{ display:"flex", alignItems:"center", marginBottom:28 }}>
      {steps.map((label,i) => {
        const n=i+1, done=n<step, active=n===step;
        return (
          <React.Fragment key={label}>
            <div style={{ display:"flex", alignItems:"center", gap:8, flexShrink:0 }}>
              <div style={{
                width:26, height:26, borderRadius:"50%", display:"grid", placeItems:"center",
                fontSize:11, fontWeight:600, flexShrink:0,
                background: (done||active) ? "var(--accent)" : "rgba(255,255,255,0.06)",
                color: (done||active) ? "#fff" : "var(--fg-3)",
                border: (done||active) ? "none" : "1px solid rgba(255,255,255,0.1)",
              }}>
                {done ? <Icon.Check size={11}/> : n}
              </div>
              <span style={{ fontSize:12, fontWeight:active?600:400, color:active?"#ECEDEF":"#6B7079", whiteSpace:"nowrap" }}>{label}</span>
            </div>
            {i < steps.length-1 && <div style={{ flex:1, height:1, background:done?"var(--accent)":"rgba(255,255,255,0.08)", margin:"0 12px", minWidth:16 }}/>}
          </React.Fragment>
        );
      })}
    </div>
  );
}

const PreviewLabel = () => (
  <div style={{ fontSize:10, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.08em", color:"#4A4F57", marginBottom:12, display:"flex", alignItems:"center", gap:6 }}>
    <div style={{ width:5, height:5, borderRadius:"50%", background:"var(--accent)" }}/> Live preview
  </div>
);

/* ── Step 1: Profile — live invoice header ── */
function Step1({ onNext, onSkip }) {
  const [name,    setName   ] = useStateL("Junaid Al-Rashid");
  const [company, setCompany] = useStateL("ManpowerHub FZCO");
  const [country, setCountry] = useStateL("AE");
  const [city,    setCity   ] = useStateL("Ras Al Khaimah");
  const [street,  setStreet ] = useStateL("RAKEZ, Building A5");
  const [vatOn,   setVatOn  ] = useStateL(false);
  const [taxOpen, setTaxOpen] = useStateL(false);
  const co = COUNTRIES.find(c=>c.code===country)||COUNTRIES[0];
  const isIN = country==="IN", isGB = country==="GB";

  const InvoicePreview = () => (
    <div style={{ background:"#fff", borderRadius:12, padding:"24px 22px", color:"#14161A", boxShadow:"0 24px 60px rgba(0,0,0,0.5)", fontSize:12 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:18 }}>
        <div>
          <div style={{ width:38, height:38, borderRadius:8, background:"#10b981", display:"grid", placeItems:"center", marginBottom:10 }}>
            <span style={{ color:"#fff", fontWeight:700, fontSize:16 }}>{((company||name||"S")[0]).toUpperCase()}</span>
          </div>
          <div style={{ fontWeight:700, fontSize:13, color:"#14161A" }}>{company||name||"Your Studio"}</div>
          <div style={{ fontSize:10.5, color:"#54585F", marginTop:3, lineHeight:1.6 }}>
            {street||"Street address"}<br/>{city||"City"}, {co.name}
          </div>
        </div>
        <div style={{ textAlign:"right" }}>
          <div style={{ fontSize:18, fontWeight:700, letterSpacing:"-0.02em" }}>INVOICE</div>
          <div style={{ fontSize:10.5, color:"#54585F", marginTop:3, lineHeight:1.7 }}>#INV-0001<br/>Issued: Jun 21, 2026<br/>Due: Jul 21, 2026</div>
        </div>
      </div>
      <div style={{ borderTop:"1px solid #ECECE7", paddingTop:12, marginBottom:12 }}>
        <div style={{ fontSize:9.5, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.05em", color:"#898E96", marginBottom:5 }}>Bill to</div>
        <div style={{ fontWeight:500 }}>Al Naboodah Contracting</div>
        <div style={{ fontSize:10.5, color:"#54585F" }}>khalid@alnaboodah.ae</div>
      </div>
      <div style={{ background:"#F4F4F1", borderRadius:6, padding:"8px 10px", marginBottom:12 }}>
        <div style={{ display:"flex", justifyContent:"space-between", fontSize:9.5, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.04em", color:"#898E96", marginBottom:5 }}>
          <span>Description</span><span>Amount</span>
        </div>
        <div style={{ display:"flex", justifyContent:"space-between" }}>
          <span>Brand identity design</span>
          <span style={{ fontWeight:600 }}>{co.currency} 8,400</span>
        </div>
      </div>
      <div style={{ display:"flex", justifyContent:"flex-end", borderTop:"1px solid #ECECE7", paddingTop:10, marginBottom:12 }}>
        <div style={{ textAlign:"right" }}>
          <div style={{ fontSize:10.5, color:"#54585F", marginBottom:2 }}>Total due</div>
          <div style={{ fontSize:17, fontWeight:700, letterSpacing:"-0.02em" }}>{co.currency} 8,400</div>
        </div>
      </div>
      <div style={{ textAlign:"center", fontSize:10, color:"#B0B4BA", borderTop:"1px solid #ECECE7", paddingTop:10 }}>
        {name||"Junaid Al-Rashid"} · {company||"ManpowerHub FZCO"} · Powered by ManpowerHub
      </div>
    </div>
  );

  return (
    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:40, alignItems:"start" }}>
      <div style={{ overflowY:"auto", maxHeight:"calc(100vh - 180px)" }}>
        <StepBar step={1}/>
        <h1 style={{ fontFamily:"var(--font-display)", fontSize:24, fontWeight:600, letterSpacing:"-0.022em", marginBottom:6, color:"#ECEDEF" }}>Tell us about your company</h1>
        <p style={{ color:"#9DA2AB", fontSize:13, marginBottom:18, lineHeight:1.55 }}>This appears on every document and invoice you send.</p>
        <div style={{ display:"grid", gap:11 }}>
          <div className="field"><label className="field__label">Full name</label>
            <input className="input input--lg" placeholder="Junaid Al-Rashid" value={name} onChange={e=>setName(e.target.value)}/></div>
          <div className="field"><label className="field__label">Company name<Opt/></label>
            <input className="input input--lg" placeholder="ManpowerHub FZCO" value={company} onChange={e=>setCompany(e.target.value)}/></div>
          <div className="field"><label className="field__label">Country</label>
            <select className="input input--lg" value={country} onChange={e=>setCountry(e.target.value)} style={{ cursor:"pointer" }}>
              {COUNTRIES.map(c=><option key={c.code} value={c.code}>{c.name}</option>)}
            </select></div>
          <div className="field"><label className="field__label">Street address</label>
            <input className="input input--lg" placeholder="Street address" value={street} onChange={e=>setStreet(e.target.value)}/></div>
          <div className="field"><label className="field__label">Line 2<Opt/></label>
            <input className="input input--lg" placeholder="Apartment, suite, office, building"/></div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            <div className="field"><label className="field__label">City</label>
              <input className="input input--lg" placeholder="Dubai" value={city} onChange={e=>setCity(e.target.value)}/></div>
            <div className="field"><label className="field__label">{co.region}</label>
              {co.regions.length>0
                ? <select className="input input--lg" style={{ cursor:"pointer" }}><option value="">Select…</option>{co.regions.map(r=><option key={r}>{r}</option>)}</select>
                : <input className="input input--lg" placeholder={co.region}/>}
            </div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            <div className="field"><label className="field__label">Postal code</label><input className="input input--lg" placeholder="00000"/></div>
            <div className="field"><label className="field__label">Currency</label>
              <div className="input input--lg" style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <span>{co.currency}</span><Icon.ChevronDown size={13}/></div></div>
          </div>
          <div style={{ border:"1px solid rgba(255,255,255,0.07)", borderRadius:10, overflow:"hidden" }}>
            <button type="button" onClick={()=>setTaxOpen(v=>!v)} style={{ width:"100%", padding:"10px 14px", background:"rgba(255,255,255,0.04)", border:"none", cursor:"pointer",
              display:"flex", justifyContent:"space-between", alignItems:"center", color:"var(--fg)", fontSize:13, fontWeight:500 }}>
              <span>Tax &amp; compliance</span>
              <Icon.ChevronDown size={13} style={{ transform:taxOpen?"rotate(180deg)":"none", transition:"transform var(--dur-fast)" }}/>
            </button>
            {taxOpen && <div style={{ padding:14, display:"grid", gap:11 }}>
              {isIN ? (<>
                <div className="field"><label className="field__label">GSTIN</label><input className="input" placeholder="29ABCDE1234F1Z5"/></div>
                <div className="field"><label className="field__label">UPI ID</label><input className="input" placeholder="name@bank"/></div>
                <div className="field"><label className="field__label">Default TDS Rate (%)</label><input className="input" type="number" min="0" max="100" step="0.5" placeholder="0"/></div>
              </>) : (<>
                <label style={{ display:"flex", alignItems:"center", gap:9, cursor:"pointer", fontSize:13 }}>
                  <input type="checkbox" checked={vatOn} onChange={e=>setVatOn(e.target.checked)} style={{ width:15, height:15 }}/>VAT registered</label>
                <div className="field"><label className="field__label">VAT number</label>
                  <input className="input" placeholder="AE123456789" disabled={!vatOn} style={{ opacity:vatOn?1:0.38 }}/></div>
              </>)}
            </div>}
          </div>
        </div>
        <div style={{ display:"flex", gap:8, marginTop:18, position:"sticky", bottom:0, paddingBottom:4 }}>
          <div style={{ flex:1 }}/>
          <button className="btn btn--ghost btn--lg" onClick={onSkip}>Skip</button>
          <button className="btn btn--primary btn--lg" onClick={onNext}>Continue <Icon.ArrowRight size={14}/></button>
        </div>
      </div>
      <div>
        <PreviewLabel/>
        <InvoicePreview/>
        <div style={{ marginTop:12, padding:"10px 14px", background:"rgba(16,185,129,0.08)", border:"1px solid rgba(16,185,129,0.14)", borderRadius:8, fontSize:12, color:"#9DA2AB", lineHeight:1.5 }}>
          <strong style={{ color:"#10b981" }}>Tip:</strong> Your name and address appear on every invoice, proposal and quote.
        </div>
      </div>
    </div>
  );
}

/* ── Step 2: Brand kit — live branded document ── */
function Step2({ onNext, onBack, onSkip }) {
  const [primary,   setPrimary  ] = useStateL("#10b981");
  const [secondary, setSecondary] = useStateL("#059669");
  const [companyName]             = useStateL("ManpowerHub FZCO");
  const presets = ["#10b981","#059669","#34d399","#3b82f6","#f59e0b","#ef4444"];
  const Swatches = ({ value, onChange }) => (
    <div style={{ display:"flex", gap:7, alignItems:"center", flexWrap:"wrap" }}>
      {presets.map(c=>(
        <div key={c} onClick={()=>onChange(c)} style={{ width:26, height:26, borderRadius:7, background:c, cursor:"pointer", flexShrink:0,
          border: value===c ? "2.5px solid #ECEDEF" : "2px solid transparent", boxSizing:"border-box" }}/>
      ))}
      <input type="color" value={value} onChange={e=>onChange(e.target.value)}
        style={{ width:26, height:26, borderRadius:7, border:"1px solid rgba(255,255,255,0.15)", cursor:"pointer", padding:2, background:"rgba(255,255,255,0.06)" }}/>
    </div>
  );

  const BrandPreview = () => (
    <div style={{ background:"#fff", borderRadius:12, overflow:"hidden", boxShadow:"0 24px 60px rgba(0,0,0,0.5)" }}>
      <div style={{ background:primary, padding:"16px 22px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:32, height:32, borderRadius:7, background:"rgba(255,255,255,0.2)", display:"grid", placeItems:"center", fontWeight:700, fontSize:15, color:"#fff" }}>S</div>
          <span style={{ color:"#fff", fontWeight:600, fontSize:13 }}>ManpowerHub FZCO</span>
        </div>
        <span style={{ color:"rgba(255,255,255,0.75)", fontSize:11 }}>INVOICE #INV-0001</span>
      </div>
      <div style={{ padding:"18px 22px", color:"#14161A", fontSize:12 }}>
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:14 }}>
          <div><div style={{ fontSize:9.5, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.05em", color:"#898E96", marginBottom:4 }}>From</div>
            <div style={{ fontWeight:500 }}>Junaid Al-Rashid</div><div style={{ color:"#54585F", fontSize:10.5 }}>RAK, UAE</div></div>
          <div style={{ textAlign:"right" }}><div style={{ fontSize:9.5, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.05em", color:"#898E96", marginBottom:4 }}>Bill to</div>
            <div style={{ fontWeight:500 }}>Al Naboodah Contracting</div><div style={{ color:"#54585F", fontSize:10.5 }}>khalid@alnaboodah.ae</div></div>
        </div>
        <div style={{ borderTop:"1px solid #ECECE7", paddingTop:10, marginBottom:10 }}>
          <div style={{ display:"flex", justifyContent:"space-between", fontSize:9.5, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.04em", color:"#898E96", marginBottom:6 }}>
            <span>Description</span><span>Amount</span>
          </div>
          <div style={{ display:"flex", justifyContent:"space-between", padding:"6px 0", borderBottom:"1px solid #F4F4F1" }}>
            <span>Brand identity design</span><span style={{ fontWeight:600 }}>AED 8,400</span>
          </div>
        </div>
        <div style={{ display:"flex", justifyContent:"flex-end" }}>
          <div style={{ background:primary, color:"#fff", borderRadius:6, padding:"6px 14px", fontWeight:600, fontSize:12 }}>AED 8,400 due</div>
        </div>
        <div style={{ marginTop:14, padding:"8px 10px", background:"#F9F9F7", borderRadius:6, borderLeft:`3px solid ${secondary}`, fontSize:10.5, color:"#54585F" }}>
          Thank you for your business! Payment due within 30 days.
        </div>
      </div>
      <div style={{ background:"#F4F4F1", padding:"10px 22px", display:"flex", gap:10, alignItems:"center" }}>
        {[primary, secondary, "#14161A"].map(c=><div key={c} style={{ width:18, height:18, borderRadius:4, background:c }}/>)}
        <span style={{ fontSize:10, color:"#898E96", marginLeft:4 }}>Brand palette</span>
      </div>
    </div>
  );

  return (
    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:40, alignItems:"start" }}>
      <div style={{ overflowY:"auto", maxHeight:"calc(100vh - 180px)" }}>
        <StepBar step={2}/>
        <h1 style={{ fontFamily:"var(--font-display)", fontSize:24, fontWeight:600, letterSpacing:"-0.022em", marginBottom:6, color:"#ECEDEF" }}>Operations setup</h1>
        <p style={{ color:"#9DA2AB", fontSize:13, marginBottom:18, lineHeight:1.55 }}>Configure your default site settings and payroll preferences.</p>
        <div style={{ display:"grid", gap:13 }}>
          <div style={{ border:"1.5px dashed rgba(255,255,255,0.12)", padding:20, borderRadius:10, textAlign:"center", cursor:"pointer",
            background:"rgba(255,255,255,0.02)", transition:"background var(--dur-fast)" }}
            onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.04)"}
            onMouseLeave={e=>e.currentTarget.style.background="rgba(255,255,255,0.02)"}>
            <Icon.Upload size={20} style={{ color:"var(--fg-3)" }}/>
            <div style={{ fontWeight:500, marginTop:8, fontSize:13, color:"#ECEDEF" }}>Drop your logo here</div>
            <div style={{ fontSize:11, color:"#6B7079", marginTop:3 }}>PNG, JPEG, WebP, SVG</div>
          </div>
          <div className="field"><label className="field__label">Primary color</label><Swatches value={primary} onChange={setPrimary}/></div>
          <div className="field"><label className="field__label">Accent color</label><Swatches value={secondary} onChange={setSecondary}/></div>
          <div className="field"><label className="field__label">Preferred font<Opt/></label>
            <input className="input input--lg" placeholder="e.g. Inter, Helvetica Neue, Garamond"/></div>
          <div className="field"><label className="field__label">Email signature<Opt/></label>
            <textarea className="input" rows={3} placeholder={"Best regards,\nJunaid Al-Rashid · ManpowerHub FZCO"} style={{ resize:"vertical", fontFamily:"inherit", lineHeight:1.5 }}/></div>
        </div>
        <div style={{ display:"flex", gap:8, marginTop:18 }}>
          <button className="btn btn--ghost btn--lg" onClick={onBack}>Back</button>
          <div style={{ flex:1 }}/>
          <button className="btn btn--ghost btn--lg" onClick={onSkip}>Skip</button>
          <button className="btn btn--primary btn--lg" onClick={onNext}>Continue <Icon.ArrowRight size={14}/></button>
        </div>
      </div>
      <div>
        <PreviewLabel/>
        <BrandPreview/>
        <div style={{ marginTop:12, padding:"10px 14px", background:"rgba(16,185,129,0.08)", border:"1px solid rgba(16,185,129,0.14)", borderRadius:8, fontSize:12, color:"#9DA2AB", lineHeight:1.5 }}>
          <strong style={{ color:"#10b981" }}>Tip:</strong> Pick colors from your existing brand — clients will recognize you instantly.
        </div>
      </div>
    </div>
  );
}

/* ── Step 3: First client — live client card ── */
function Step3({ onFinish, onBack }) {
  const [clientName, setClientName] = useStateL("Al Naboodah Contracting");
  const [email,      setEmail     ] = useStateL("khalid@alnaboodah.ae");
  const [phone,      setPhone     ] = useStateL("+971 4 800 1100");
  const [contact,    setContact   ] = useStateL("Hamad Al Naboodah");
  const [notes,      setNotes     ] = useStateL("Preferred contractor — 3 active sites");

  const ClientCard = () => (
    <div style={{ background:"#fff", borderRadius:12, overflow:"hidden", boxShadow:"0 24px 60px rgba(0,0,0,0.5)", color:"#14161A", fontSize:12 }}>
      <div style={{ background:"linear-gradient(135deg,#10b981,#059669)", padding:"22px 22px 18px", position:"relative" }}>
        <div style={{ width:44, height:44, borderRadius:12, background:"rgba(255,255,255,0.2)", display:"grid", placeItems:"center", marginBottom:10, fontSize:20, fontWeight:700, color:"#fff" }}>
          {(clientName||"?")[0].toUpperCase()}
        </div>
        <div style={{ fontSize:16, fontWeight:700, color:"#fff", letterSpacing:"-0.01em" }}>{clientName||"Client name"}</div>
        <div style={{ fontSize:11, color:"rgba(255,255,255,0.7)", marginTop:3 }}>{contact||"Contact person"}</div>
        <div style={{ position:"absolute", top:16, right:16, background:"rgba(255,255,255,0.15)", borderRadius:6, padding:"3px 9px", fontSize:10, fontWeight:600, color:"#fff" }}>Active</div>
      </div>
      <div style={{ padding:"16px 20px", display:"grid", gap:10 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 10px", background:"#F9F9F7", borderRadius:7 }}>
          <Icon.Mail size={13} style={{ color:"#898E96", flexShrink:0 }}/>
          <span style={{ color: email?"#14161A":"#B0B4BA" }}>{email||"Email not set"}</span>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 10px", background:"#F9F9F7", borderRadius:7 }}>
          <Icon.Phone size={13} style={{ color:"#898E96", flexShrink:0 }}/>
          <span style={{ color: phone?"#14161A":"#B0B4BA" }}>{phone||"Phone not set"}</span>
        </div>
        {notes && <div style={{ padding:"8px 10px", background:"#FFFBF0", border:"1px solid #F0E8CC", borderRadius:7, fontSize:11, color:"#54585F", lineHeight:1.5 }}>
          <span style={{ fontWeight:600, color:"#B36A12", fontSize:10, textTransform:"uppercase", letterSpacing:"0.04em" }}>Note </span>{notes}
        </div>}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
          <div style={{ textAlign:"center", padding:"10px 0", background:"#F4F4F1", borderRadius:7 }}>
            <div style={{ fontSize:17, fontWeight:700 }}>0</div>
            <div style={{ fontSize:10, color:"#898E96", marginTop:2 }}>Invoices</div>
          </div>
          <div style={{ textAlign:"center", padding:"10px 0", background:"#F4F4F1", borderRadius:7 }}>
            <div style={{ fontSize:17, fontWeight:700 }}>0</div>
            <div style={{ fontSize:10, color:"#898E96", marginTop:2 }}>Projects</div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:40, alignItems:"start" }}>
      <div style={{ overflowY:"auto", maxHeight:"calc(100vh - 180px)" }}>
        <StepBar step={3}/>
        <h1 style={{ fontFamily:"var(--font-display)", fontSize:24, fontWeight:600, letterSpacing:"-0.022em", marginBottom:6, color:"#ECEDEF" }}>Add your first client</h1>
        <p style={{ color:"#9DA2AB", fontSize:13, marginBottom:18, lineHeight:1.55 }}>We'll pre-fill their info on your first invoice.</p>
        <div style={{ display:"grid", gap:11 }}>
          <div className="field"><label className="field__label">Client name</label>
            <input className="input input--lg" placeholder="e.g. Al Naboodah Contracting" value={clientName} onChange={e=>setClientName(e.target.value)}/></div>
          <div className="field"><label className="field__label">Email<Opt/></label>
            <input className="input input--lg" type="email" placeholder="name@company.com" value={email} onChange={e=>setEmail(e.target.value)}/></div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            <div className="field"><label className="field__label">Phone<Opt/></label>
              <input className="input input--lg" placeholder="+971 50 000 0000" value={phone} onChange={e=>setPhone(e.target.value)}/></div>
            <div className="field"><label className="field__label">Contact name<Opt/></label>
              <input className="input input--lg" placeholder="Dana Rahman" value={contact} onChange={e=>setContact(e.target.value)}/></div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            <div className="field"><label className="field__label">Company<Opt/></label>
              <input className="input input--lg" placeholder="Al Naboodah Contracting"/></div>
            <div className="field"><label className="field__label">Currency<Opt/></label>
              <div className="input input--lg" style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <span style={{ color:"var(--fg-3)" }}>Default · AED</span><Icon.ChevronDown size={13}/></div></div>
          </div>
          <div className="field"><label className="field__label">Address<Opt/></label>
            <textarea className="input" rows={2} placeholder="Street, city, region…" style={{ resize:"vertical", fontFamily:"inherit" }}/></div>
          <div className="field"><label className="field__label">Notes<Opt/></label>
            <textarea className="input" rows={2} placeholder="Any notes about this client…" value={notes} onChange={e=>setNotes(e.target.value)} style={{ resize:"vertical", fontFamily:"inherit" }}/></div>
        </div>
        <div style={{ display:"flex", gap:8, marginTop:18 }}>
          <button className="btn btn--ghost btn--lg" onClick={onBack}>Back</button>
          <div style={{ flex:1 }}/>
          <button className="btn btn--ghost btn--lg" onClick={onFinish}>Skip</button>
          <button className="btn btn--primary btn--lg" onClick={onFinish}>Finish setup <Icon.ArrowRight size={14}/></button>
        </div>
      </div>
      <div>
        <PreviewLabel/>
        <ClientCard/>
        <div style={{ marginTop:12, padding:"10px 14px", background:"rgba(16,185,129,0.08)", border:"1px solid rgba(16,185,129,0.14)", borderRadius:8, fontSize:12, color:"#9DA2AB", lineHeight:1.5 }}>
          <strong style={{ color:"#10b981" }}>Tip:</strong> You can add more clients anytime from the Clients section.
        </div>
      </div>
    </div>
  );
}

/* ══════════════════ RIGHT PANEL ══════════════════ */
/* Mini product window — composed dashboard mockup */
function MiniDash() {
  const bars = [34, 52, 41, 68, 58, 82, 74];
  const months = ["J","F","M","A","M","J","J"];
  return (
    <div style={{
      width:"100%",
      background:"linear-gradient(180deg,#16181C 0%,#121317 100%)",
      border:"1px solid rgba(255,255,255,0.08)",
      borderRadius:14,
      overflow:"hidden",
      boxShadow:"0 40px 90px -20px rgba(0,0,0,0.7), 0 1px 0 rgba(255,255,255,0.06) inset",
    }}>
      {/* window chrome */}
      <div style={{ display:"flex", alignItems:"center", gap:8, padding:"11px 14px", borderBottom:"1px solid rgba(255,255,255,0.06)", background:"rgba(255,255,255,0.015)" }}>
        <div style={{ display:"flex", gap:6 }}>
          {["#E0625C","#E0B23C","#4FB369"].map(c=><div key={c} style={{ width:9, height:9, borderRadius:"50%", background:c, opacity:.85 }}/>)}
        </div>
        <div style={{ flex:1, textAlign:"center", fontSize:10.5, color:"#5A5F68", letterSpacing:"0.02em" }}>app.manpowerhub.ae/dashboard</div>
        <div style={{ width:42 }}/>
      </div>

      {/* body: rail + content */}
      <div style={{ display:"flex" }}>
        {/* slim rail */}
        <div style={{ width:44, borderRight:"1px solid rgba(255,255,255,0.06)", padding:"14px 0", display:"flex", flexDirection:"column", alignItems:"center", gap:12 }}>
          <div style={{ width:24, height:24, borderRadius:7, background:"linear-gradient(135deg,#10b981,#059669)", display:"grid", placeItems:"center", fontFamily:"var(--font-display)", fontWeight:700, fontSize:12, color:"#fff", letterSpacing:"-0.04em" }}>M</div>
          {[true,false,false,false].map((on,i)=>(
            <div key={i} style={{ width:18, height:18, borderRadius:5, background:on?"rgba(16,185,129,0.22)":"transparent", display:"grid", placeItems:"center" }}>
              <div style={{ width:11, height:11, borderRadius:3, background:on?"#10b981":"rgba(255,255,255,0.14)" }}/>
            </div>
          ))}
        </div>

        {/* content */}
        <div style={{ flex:1, padding:"16px 18px", display:"grid", gap:14 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
            <div>
              <div style={{ fontSize:10, color:"#6B7079", letterSpacing:"0.06em", textTransform:"uppercase", fontWeight:600, marginBottom:5 }}>Payroll · June 2026</div>
              <div style={{ display:"flex", alignItems:"baseline", gap:9 }}>
                <div style={{ fontFamily:"var(--font-display)", fontSize:24, fontWeight:600, letterSpacing:"-0.03em", color:"#ECEDEF" }}>AED 284K</div>
                <span style={{ fontSize:10.5, fontWeight:600, background:"rgba(16,185,129,0.15)", color:"#10b981", border:"1px solid rgba(16,185,129,0.22)", borderRadius:5, padding:"1px 6px" }}>2,847</span>
              </div>
            </div>
            <div style={{ fontSize:10, color:"#5A5F68", border:"1px solid rgba(255,255,255,0.08)", borderRadius:6, padding:"3px 8px" }}>Jul 2026</div>
          </div>

          {/* bar chart */}
          <div style={{ display:"flex", alignItems:"flex-end", gap:8, height:64, padding:"0 1px" }}>
            {bars.map((h,i)=>(
              <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:6 }}>
                <div style={{ width:"100%", height:`${h}%`, borderRadius:"4px 4px 2px 2px",
                  background: i===bars.length-1 ? "linear-gradient(180deg,#10b981,#059669)" : "rgba(16,185,129,0.20)",
                  boxShadow: i===bars.length-1 ? "0 0 18px rgba(16,185,129,0.45)" : "none" }}/>
                <span style={{ fontSize:9, color:"#4A4F57" }}>{months[i]}</span>
              </div>
            ))}
          </div>

          {/* invoice rows */}
          <div style={{ display:"grid", gap:7 }}>
            {[
              { n:"Al Naboodah", id:"KAT/05/024", amt:"14,385", paid:true },
              { n:"Emaar Props",   id:"KAT/05/023", amt:"8,750",  paid:false },
            ].map(r=>(
              <div key={r.id} style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 10px", background:"rgba(255,255,255,0.025)", border:"1px solid rgba(255,255,255,0.05)", borderRadius:8 }}>
                <div style={{ width:24, height:24, borderRadius:6, background:"rgba(16,185,129,0.16)", display:"grid", placeItems:"center", fontSize:11, fontWeight:700, color:"#6ddfb8", flexShrink:0 }}>{r.n[0]}</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:11.5, fontWeight:500, color:"#ECEDEF", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{r.n}</div>
                  <div style={{ fontSize:9.5, color:"#5A5F68" }}>{r.id}</div>
                </div>
                <div style={{ fontFamily:"var(--font-display)", fontSize:12, fontWeight:600, color:"#ECEDEF" }}>AED {r.amt}</div>
                <div style={{ fontSize:9, fontWeight:600, letterSpacing:"0.03em", padding:"2px 7px", borderRadius:5,
                  background: r.paid ? "rgba(63,184,125,0.15)" : "rgba(224,178,60,0.13)",
                  color: r.paid ? "#3FB87D" : "#E0B23C",
                  border: `1px solid ${r.paid ? "rgba(63,184,125,0.22)" : "rgba(224,178,60,0.22)"}` }}>
                  {r.paid ? "Paid" : "Due"}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function RightPanel() {
  return (
    <div style={{ position:"relative", overflow:"hidden", display:"flex", flexDirection:"column", justifyContent:"center",
      padding:"56px 64px",
      background:"linear-gradient(165deg,#0C0E13 0%,#090A0E 55%,#070809 100%)"
    }}>
      {/* single soft accent glow, top-right */}
      <div style={{ position:"absolute", top:"-18%", right:"-12%", width:560, height:560, borderRadius:"50%",
        background:"radial-gradient(circle, rgba(16,185,129,0.16) 0%, rgba(16,185,129,0.04) 42%, transparent 70%)",
        filter:"blur(8px)", pointerEvents:"none" }}/>
      {/* faint warm counter-glow, bottom-left */}
      <div style={{ position:"absolute", bottom:"-14%", left:"-10%", width:420, height:420, borderRadius:"50%",
        background:"radial-gradient(circle, rgba(184,128,74,0.07) 0%, transparent 68%)", pointerEvents:"none" }}/>
      {/* fine line grid */}
      <svg width="100%" height="100%" style={{ position:"absolute", inset:0, opacity:0.5, pointerEvents:"none",
        WebkitMaskImage:"radial-gradient(ellipse 70% 70% at 60% 40%, #000 0%, transparent 80%)",
        maskImage:"radial-gradient(ellipse 70% 70% at 60% 40%, #000 0%, transparent 80%)" }}>
        <defs><pattern id="grid" width="44" height="44" patternUnits="userSpaceOnUse">
          <path d="M44 0H0V44" fill="none" stroke="rgba(255,255,255,0.035)" strokeWidth="1"/>
        </pattern></defs>
        <rect width="100%" height="100%" fill="url(#grid)"/>
      </svg>

      <div className="fade-up" style={{ maxWidth:480, position:"relative", zIndex:1 }}>
        <div style={{ display:"inline-flex", alignItems:"center", gap:7, background:"rgba(16,185,129,0.10)", border:"1px solid rgba(16,185,129,0.20)", borderRadius:999, padding:"5px 13px", marginBottom:24 }}>
          <div style={{ width:6, height:6, borderRadius:"50%", background:"var(--accent)", boxShadow:"0 0 8px rgba(16,185,129,0.8)" }}/>
          <span style={{ fontSize:10.5, fontWeight:600, color:"#6ddfb8", letterSpacing:"0.1em", textTransform:"uppercase" }}>Built for workforce teams</span>
        </div>
        <h2 style={{ fontFamily:"var(--font-display)", fontSize:40, fontWeight:600, letterSpacing:"-0.035em", lineHeight:1.06, marginBottom:18, color:"#F2F3F5" }}>
          Your workforce,<br/>managed in real-time<br/>from one dashboard.
        </h2>
        <p style={{ fontSize:14.5, color:"#9DA2AB", lineHeight:1.6, marginBottom:40, maxWidth:400 }}>
          One platform for workers, sites, payroll and compliance. The AI handles allocation and docs — so you stay on top of operations.
        </p>

        {/* Product window with overlapping floating cards */}
        <div style={{ position:"relative", transform:"perspective(1400px) rotateY(-9deg) rotateX(3deg)", transformOrigin:"left center" }}>
          <MiniDash/>

          {/* floating AI card — top-right overlap */}
          <div style={{ position:"absolute", top:-22, right:-46, width:212,
            background:"rgba(20,22,27,0.92)", backdropFilter:"blur(14px)",
            border:"1px solid rgba(16,185,129,0.22)", borderRadius:11, padding:"11px 12px",
            display:"flex", alignItems:"center", gap:10,
            boxShadow:"0 18px 44px rgba(0,0,0,0.55)" }}>
            <div style={{ width:30, height:30, borderRadius:8, background:"linear-gradient(135deg,#10b981,#059669)", color:"#fff", display:"grid", placeItems:"center", flexShrink:0 }}>
              <Icon.Sparkles size={14}/>
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:11.5, fontWeight:500, color:"#ECEDEF", lineHeight:1.3 }}>Follow-up drafted</div>
              <div style={{ fontSize:10, color:"#6B7079", marginTop:1 }}>Site Alpha · 142 workers</div>
            </div>
          </div>

          {/* floating paid card — bottom-left overlap */}
          <div style={{ position:"absolute", bottom:-20, left:-40, width:206,
            background:"rgba(20,22,27,0.92)", backdropFilter:"blur(14px)",
            border:"1px solid rgba(63,184,125,0.22)", borderRadius:11, padding:"11px 12px",
            display:"flex", alignItems:"center", gap:10,
            boxShadow:"0 18px 44px rgba(0,0,0,0.55)" }}>
            <Icon.CircleCheck size={18} style={{ color:"#3FB87D", flexShrink:0 }}/>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:11.5, color:"#ECEDEF", lineHeight:1.3 }}><strong style={{ fontWeight:600 }}>Emaar Properties</strong> paid</div>
              <div style={{ fontSize:10, color:"#6B7079", marginTop:1 }}>KAT/05/023 · 5 min ago</div>
            </div>
            <span style={{ fontFamily:"var(--font-display)", fontSize:12.5, fontWeight:600, color:"#3FB87D", flexShrink:0 }}>+8,750</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════ FLOATING AI ARTWORK ══════════════════ */
/* Cards drifting around the auth card — the AI quietly doing the work */
function FloatChip({ left, top, rot, dur, delay, accent, children }) {
  return (
    <div style={{ position:"absolute", left, top, transform:`translate(-50%,-50%) rotate(${rot}deg)` }}>
      <div className="auth-float" style={{ animationDuration:`${dur}s`, animationDelay:`${delay}s`,
        background:"rgba(19,21,26,0.82)", backdropFilter:"blur(16px)",
        border:`1px solid ${accent}`, borderRadius:13, padding:"11px 14px",
        display:"flex", alignItems:"center", gap:11, whiteSpace:"nowrap",
        boxShadow:"0 24px 56px rgba(0,0,0,0.6)" }}>
        {children}
      </div>
    </div>
  );
}

function OrbitArt() {
  return (
    <div className="auth-art" style={{ position:"absolute", inset:0, pointerEvents:"none", zIndex:0, overflow:"hidden" }}>
      {/* soft aurora */}
      <div style={{ position:"absolute", top:"-24%", left:"50%", transform:"translateX(-50%)", width:900, height:700, borderRadius:"50%",
        background:"radial-gradient(circle, rgba(16,185,129,0.18) 0%, rgba(16,185,129,0.04) 44%, transparent 70%)", filter:"blur(6px)" }}/>
      <div style={{ position:"absolute", bottom:"-22%", left:"16%", width:520, height:460, borderRadius:"50%",
        background:"radial-gradient(circle, rgba(16,185,129,0.09) 0%, transparent 66%)" }}/>
      <div style={{ position:"absolute", bottom:"-18%", right:"14%", width:440, height:400, borderRadius:"50%",
        background:"radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 66%)" }}/>

      {/* AI core glow behind the card */}
      <div style={{ position:"absolute", top:"50%", left:"50%", width:340, height:340, transform:"translate(-50%,-50%)", borderRadius:"50%",
        background:"radial-gradient(circle, rgba(16,185,129,0.22) 0%, rgba(16,185,129,0.06) 40%, transparent 70%)" }}/>

      {/* data-flow connectors from the core out to each card */}
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position:"absolute", inset:0, width:"100%", height:"100%", overflow:"visible" }}>
        {[
          { d:"M50 50 Q 66 30 71 18",  c:"rgba(16,185,129,0.55)", dur:"1.4s" },
          { d:"M50 50 Q 70 50 83 55",  c:"rgba(16,185,129,0.5)",   dur:"1.7s" },
          { d:"M50 50 Q 32 66 17 72",  c:"rgba(16,185,129,0.5)",  dur:"1.9s" },
          { d:"M50 50 Q 32 40 18 28",  c:"rgba(16,185,129,0.5)",   dur:"1.6s" },
        ].map((l,i)=>(
          <g key={i}>
            <path d={l.d} fill="none" stroke={l.c} strokeWidth="1" strokeOpacity="0.28" vectorEffect="non-scaling-stroke"/>
            <path d={l.d} fill="none" stroke={l.c} strokeWidth="1.4" strokeDasharray="3 9" strokeLinecap="round" vectorEffect="non-scaling-stroke">
              <animate attributeName="stroke-dashoffset" from="0" to="-12" dur={l.dur} repeatCount="indefinite"/>
            </path>
          </g>
        ))}
      </svg>

      {/* ① AI actively working — pulsing dots */}
      <FloatChip left="71%" top="18%" rot={-3} dur={6.5} delay={0} accent="rgba(16,185,129,0.30)">
        <div style={{ width:32, height:32, borderRadius:9, background:"linear-gradient(135deg,#10b981,#059669)", color:"#fff", display:"grid", placeItems:"center", flexShrink:0 }}>
          <Icon.Sparkles size={15}/>
        </div>
        <div>
          <div style={{ display:"flex", alignItems:"center", gap:7 }}>
            <span style={{ fontSize:12, fontWeight:500, color:"#ECEDEF" }}>Planning Agent running</span>
            <span className="auth-dots" style={{ display:"inline-flex", gap:3 }}>
              {[0,1,2].map(i=><span key={i} style={{ width:4, height:4, borderRadius:"50%", background:"#10b981", animationDelay:`${i*0.18}s` }}/>)}
            </span>
          </div>
          <div style={{ fontSize:10.5, color:"#6B7079", marginTop:2 }}>Site Alpha · 142 workers</div>
        </div>
        <span style={{ fontSize:9.5, fontWeight:600, background:"rgba(16,185,129,0.16)", color:"#6ddfb8", border:"1px solid rgba(16,185,129,0.28)", borderRadius:5, padding:"2px 6px", letterSpacing:"0.04em", flexShrink:0 }}>AI</span>
      </FloatChip>

      {/* ② Invoice paid */}
      <FloatChip left="83%" top="55%" rot={2.5} dur={7.5} delay={1.2} accent="rgba(16,185,129,0.28)">
        <Icon.CircleCheck size={19} style={{ color:"#10b981", flexShrink:0 }}/>
        <div>
          <div style={{ fontSize:12, color:"#ECEDEF", lineHeight:1.3 }}><strong style={{ fontWeight:600 }}>Emaar Properties</strong> paid</div>
          <div style={{ fontSize:10.5, color:"#6B7079", marginTop:2 }}>KAT/05/023 · 5 min ago</div>
        </div>
        <span style={{ fontFamily:"var(--font-display)", fontSize:13, fontWeight:600, color:"#10b981", flexShrink:0, marginLeft:2 }}>+8,750</span>
      </FloatChip>

      {/* ③ Reminder auto-sent */}
      <FloatChip left="17%" top="72%" rot={3} dur={8} delay={0.6} accent="rgba(16,185,129,0.24)">
        <div style={{ width:30, height:30, borderRadius:8, background:"rgba(16,185,129,0.16)", display:"grid", placeItems:"center", flexShrink:0 }}>
          <Icon.Mail size={14} style={{ color:"#6ddfb8" }}/>
        </div>
        <div>
          <div style={{ fontSize:12, fontWeight:500, color:"#ECEDEF" }}>Invoice auto-sent</div>
          <div style={{ fontSize:10.5, color:"#6B7079", marginTop:2 }}>KAT/05/024 · Document Writer</div>
        </div>
        <span style={{ fontSize:9.5, fontWeight:600, background:"rgba(16,185,129,0.16)", color:"#6ddfb8", border:"1px solid rgba(16,185,129,0.28)", borderRadius:5, padding:"2px 6px", letterSpacing:"0.04em", flexShrink:0 }}>AI</span>
      </FloatChip>

      {/* ④ Revenue metric */}
      <FloatChip left="18%" top="28%" rot={-2.5} dur={7} delay={1.8} accent="rgba(16,185,129,0.26)">
        <div style={{ fontSize:10.5, color:"#6B7079", letterSpacing:"0.05em", textTransform:"uppercase", fontWeight:600 }}>Active workers</div>
        <span style={{ fontFamily:"var(--font-display)", fontSize:16, fontWeight:600, color:"#ECEDEF", letterSpacing:"-0.02em" }}>2,847</span>
      </FloatChip>
    </div>
  );
}

/* ══════════════════ ROOT ══════════════════ */
function Login({ goto, theme, setTheme }) {
  const [screen, setScreen] = useStateL("login"); // login|signup|forgot|update|onboard
  const [obStep, setObStep] = useStateL(1);
  const goTo = s => { setScreen(s); if (s==="onboard") setObStep(1); };
  const isOnboard = screen === "onboard";

  const artBg = "radial-gradient(ellipse 90% 70% at 15% 30%, rgba(16,185,129,0.10) 0%, transparent 65%), radial-gradient(ellipse 70% 90% at 5% 90%, rgba(16,185,129,0.07) 0%, transparent 60%), #0A0B0F";

  if (isOnboard) return (
    <div data-theme="dark" style={{ height:"100vh", overflow:"hidden", background:artBg, display:"flex", flexDirection:"column" }}>
      {/* Top bar */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"18px 40px", flexShrink:0, borderBottom:"1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:9 }}>
          <div style={{ width:28, height:28, borderRadius:7, background:"linear-gradient(135deg,#10b981,#059669)", color:"#fff", display:"grid", placeItems:"center", fontFamily:"var(--font-display)", fontWeight:700, fontSize:14, letterSpacing:"-0.04em" }}>M</div>
          <span style={{ fontFamily:"var(--font-display)", fontSize:15, fontWeight:600, letterSpacing:"-0.02em", color:"#ECEDEF" }}>ManpowerHub</span>
        </div>
        <button className="btn btn--ghost btn--sm" onClick={()=>goto("dashboard")}>Skip setup <Icon.ArrowRight size={12}/></button>
      </div>
      {/* Centered card */}
      <div style={{ flex:1, overflow:"hidden", display:"flex", alignItems:"center", justifyContent:"center", padding:"24px 40px" }}>
        <div style={{ width:"100%", maxWidth:860, background:"rgba(22,24,28,0.82)", backdropFilter:"blur(20px)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:20, padding:"36px 40px", boxShadow:"0 24px 80px rgba(0,0,0,0.55), 0 1px 0 rgba(255,255,255,0.05) inset" }}>
          {obStep===1 && <Step1 onNext={()=>setObStep(2)} onSkip={()=>goto("dashboard")}/>}
          {obStep===2 && <Step2 onNext={()=>setObStep(3)} onBack={()=>setObStep(1)} onSkip={()=>goto("dashboard")}/>}
          {obStep===3 && <Step3 onFinish={()=>goto("dashboard")} onBack={()=>setObStep(2)}/>}
        </div>
      </div>
      <div style={{ textAlign:"center", fontSize:11, color:"#2E3138", padding:"12px 0", flexShrink:0 }}>© 2026 ManpowerHub · Privacy · Terms</div>
    </div>
  );

  return (
    <div className="login-split" data-theme="dark" style={{ height:"100vh", overflow:"hidden", display:"grid", gridTemplateColumns:"1fr 1fr", background:artBg }}>
      {/* Left — form (scrollable) */}
      <div style={{ display:"flex", flexDirection:"column", padding:"28px 48px", justifyContent:"space-between", height:"100%", overflow:"hidden", boxSizing:"border-box",
        borderRight:"1px solid rgba(255,255,255,0.05)"
      }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div style={{ display:"flex", alignItems:"center", gap:9 }}>
            <div style={{ width:30, height:30, borderRadius:8, background:"linear-gradient(135deg,#10b981,#059669)", color:"#fff", display:"grid", placeItems:"center", fontFamily:"var(--font-display)", fontWeight:700, fontSize:15, letterSpacing:"-0.04em" }}>M</div>
            <span style={{ fontFamily:"var(--font-display)", fontSize:15, fontWeight:600, letterSpacing:"-0.02em", color:"#ECEDEF" }}>ManpowerHub</span>
          </div>
          <button className="btn btn--ghost btn--sm" onClick={()=>goto("design-system")}><Icon.ChevronLeft size={12}/>Back to system</button>
        </div>

        <div className="fade-up" style={{ maxWidth:400, width:"100%", margin:"0 auto", background:"rgba(22,24,28,0.80)", backdropFilter:"blur(20px)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:18, padding:"36px 32px", boxShadow:"0 24px 60px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.05) inset",
          overflowY:"auto", maxHeight:"calc(100vh - 120px)", boxSizing:"border-box"
        }}>
          {screen==="login"  && <LoginForm  goTo={goTo} goto={goto}/>}
          {screen==="signup" && <SignUpForm  goTo={goTo}/>}
          {screen==="forgot" && <ForgotForm  goTo={goTo}/>}
          {screen==="update" && <UpdatePwForm goTo={goTo}/>}
        </div>

        <div style={{ fontSize:11.5, color:"#4A4F57", display:"flex", justifyContent:"space-between" }}>
          <span>© 2026 ManpowerHub</span>
          <div style={{ display:"flex", gap:14 }}><span>Privacy</span><span>Terms</span><span>Help</span></div>
        </div>
      </div>

      {/* Right — visual */}
      <RightPanel/>
    </div>
  );
}

window.Screens = window.Screens || {};
window.Screens.Login = Login;
