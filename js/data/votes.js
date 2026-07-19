export const MEMBERS_SHORT = ['Brent','Crisp','Hambrick','Hampton','Menke','LusbyMitchell','TingleSames','Stone'];
export const MEMBERS_FULL = {
  'Brent':         { full:'Sonja Wilkins Brent', photo:2052, av:'av-g', ini:'SW' },
  'Crisp':         { full:'Michael Crisp',        photo:3152, av:'av-g', ini:'MC' },
  'Hambrick':      { full:'Willow Hambrick',      photo:2054, av:'av-g', ini:'WH' },
  'Hampton':       { full:'Greg Hampton',         photo:2050, av:'av-g', ini:'GH' },
  'Menke':         { full:'Kim Menke',            photo:3154, av:'av-g', ini:'KM' },
  'LusbyMitchell': { full:'Tammy Lusby Mitchell', photo:3158, av:'av-g', ini:'TL' },
  'TingleSames':   { full:'Karen Tingle Sames',   photo:3168, av:'av-g', ini:'KT' },
  'Stone':         { full:'Todd Stone',           photo:2053, av:'av-g', ini:'TS' },
};

// Y=Yea  N=Nay  A=Abstain/Recused  X=Absent/Not on record
// confidence:'pending' = stub added from meeting summary; awaits minute verification
export const VOTES = [
  { id:'v001', date:'Nov 24 2025', yr:'2025', motion:'Approve Minutes from Nov 10 2025',
    mover:'Wilkins Brent', seconder:'Hambrick', result:'Unanimous', topic:'motion', type:'procedural',
    sig:'Routine housekeeping — the Council officially accepted the written record of its previous meeting as accurate. Required at every session so the public record is legally certified.',
    votes:{Brent:'Y',Crisp:'Y',Hambrick:'Y',Hampton:'Y',Menke:'Y',LusbyMitchell:'Y',TingleSames:'Y',Stone:'Y'} },

  { id:'v002', date:'Nov 24 2025', yr:'2025', motion:'Stockyards Bank Reinvestment Municipal Order',
    mover:'Lusby Mitchell', seconder:'Hampton', result:'Unanimous', topic:'finance', type:'municipal-order',
    sig:'Authorized the city to reinvest municipal funds with Stockyards Bank. This is a routine treasury management decision ensuring city cash reserves earn the best available interest rate while remaining accessible for operations.',
    votes:{Brent:'Y',Crisp:'Y',Hambrick:'Y',Hampton:'Y',Menke:'Y',LusbyMitchell:'Y',TingleSames:'Y',Stone:'Y'} },

  { id:'v003', date:'Nov 24 2025', yr:'2025', motion:'Board of Adjustment Reappointment — Frank Allen',
    mover:'Stone', seconder:'Lusby Mitchell', result:'Unanimous', topic:'personnel', type:'appointment',
    sig:'Continued Frank Allen\'s service on the Georgetown Board of Adjustment — the body that hears requests for variances from zoning rules (e.g., a homeowner wanting a smaller setback or a business seeking a special use). His reappointment maintains experienced membership on this quasi-judicial board that directly affects property rights.',
    votes:{Brent:'Y',Crisp:'Y',Hambrick:'Y',Hampton:'Y',Menke:'Y',LusbyMitchell:'Y',TingleSames:'Y',Stone:'Y'} },

  { id:'v004', date:'Nov 24 2025', yr:'2025', motion:'Board of Adjustment Reappointment — Virginia Teague',
    mover:'Hambrick', seconder:'Menke', result:'Unanimous', topic:'personnel', type:'appointment',
    sig:'Continued Virginia Teague\'s service on the Georgetown Board of Adjustment alongside Frank Allen. The Board needs a quorum to hear cases, so maintaining experienced members prevents backlogs in variance and conditional-use permit decisions that affect Georgetown property owners and developers.',
    votes:{Brent:'Y',Crisp:'Y',Hambrick:'Y',Hampton:'Y',Menke:'Y',LusbyMitchell:'Y',TingleSames:'Y',Stone:'Y'} },

  { id:'v005', date:'Nov 24 2025', yr:'2025', motion:'Board of Ethics Reappointment — Renee Causey-Upton',
    mover:'Lusby Mitchell', seconder:'Hampton', result:'Unanimous', topic:'personnel', type:'appointment',
    sig:'Continued Renee Causey-Upton\'s service on the Georgetown Board of Ethics — the independent body that enforces the city\'s Code of Ethics, investigates complaints about official misconduct, and issues advisory opinions to city officials. An active Ethics Board is a key check on city government accountability.',
    votes:{Brent:'Y',Crisp:'Y',Hambrick:'Y',Hampton:'Y',Menke:'Y',LusbyMitchell:'Y',TingleSames:'Y',Stone:'Y'} },

  { id:'v006', date:'Nov 24 2025', yr:'2025', motion:'Board of Ethics Reappointment — Gui Cozzi',
    mover:'Stone', seconder:'Wilkins Brent', result:'Unanimous', topic:'personnel', type:'appointment',
    sig:'Continued Gui Cozzi\'s service on the Board of Ethics alongside Causey-Upton. Notably, two proposed Ethics Board reappointments were pulled from this meeting\'s agenda by Mayor Jenkins before it began — meaning only these two reappointments proceeded, leaving the question of the other seats unresolved.',
    votes:{Brent:'Y',Crisp:'Y',Hambrick:'Y',Hampton:'Y',Menke:'Y',LusbyMitchell:'Y',TingleSames:'Y',Stone:'Y'} },

  { id:'v007', date:'Nov 24 2025', yr:'2025', motion:'Housing Authority Reappointment — Patricia Harman',
    mover:'Menke', seconder:'Hambrick', result:'Unanimous', topic:'personnel', type:'appointment',
    sig:'Continued Patricia Harman\'s service on the Georgetown Housing Authority Board, which governs the city\'s affordable housing programs for low- and moderate-income residents. As Georgetown grows rapidly, the Housing Authority\'s role in maintaining affordable options is increasingly important.',
    votes:{Brent:'Y',Crisp:'Y',Hambrick:'Y',Hampton:'Y',Menke:'Y',LusbyMitchell:'Y',TingleSames:'Y',Stone:'Y'} },

  { id:'v008', date:'Nov 24 2025', yr:'2025', motion:'Human Rights Commission Reappointment — April Baker',
    mover:'Stone', seconder:'Hampton', result:'7-0 (1 recusal)', topic:'personnel', type:'appointment',
    note:'Wilkins Brent recused — family member conflict of interest',
    sig:'Continued April Baker\'s service on the Georgetown Human Rights Commission, which receives and investigates discrimination complaints based on race, sex, religion, disability, and other protected categories. This vote passed 7-0 after Councilmember Wilkins Brent voluntarily recused herself because the appointee is a family member — a demonstration of the ethics principles the Council had just reinforced.',
    votes:{Brent:'A',Crisp:'Y',Hambrick:'Y',Hampton:'Y',Menke:'Y',LusbyMitchell:'Y',TingleSames:'Y',Stone:'Y'} },

  { id:'v009', date:'Nov 24 2025', yr:'2025', motion:'GMWSS Reappointment — Jason Baird',
    mover:'Hambrick', seconder:'Menke', result:'Unanimous', topic:'personnel', type:'appointment',
    sig:'Continued Jason Baird\'s service on the GMWSS (Georgetown Municipal Water & Sewer Service) Board, which sets water and sewer rates, approves capital projects, and manages the infrastructure that serves Georgetown residents. The Board was managing over $296,000 in contractor payments at this same meeting.',
    votes:{Brent:'Y',Crisp:'Y',Hambrick:'Y',Hampton:'Y',Menke:'Y',LusbyMitchell:'Y',TingleSames:'Y',Stone:'Y'} },

  { id:'v010', date:'Nov 24 2025', yr:'2025', motion:'GMWSS New Appointment — Kent Chandler',
    mover:'Hambrick', seconder:'Menke', result:'Unanimous', topic:'personnel', type:'appointment',
    sig:'Added Kent Chandler to the GMWSS Board — a new appointment, not a reappointment. This fills a vacancy and brings fresh membership to the board overseeing Georgetown\'s water and sewer utility at a time of rapid development and infrastructure expansion.',
    votes:{Brent:'Y',Crisp:'Y',Hambrick:'Y',Hampton:'Y',Menke:'Y',LusbyMitchell:'Y',TingleSames:'Y',Stone:'Y'} },

  { id:'v011', date:'Nov 24 2025', yr:'2025', motion:'Table GMWSS Reappointment of Jeff Klocke to Dec 8',
    mover:'Tingle Sames', seconder:'Wilkins Brent', result:'Unanimous', topic:'personnel', type:'procedural',
    note:'Tabled to Dec 8 2025',
    sig:'Delayed a decision on Jeff Klocke\'s GMWSS reappointment to allow more time for Council review — the first application of the new resume-review process Hampton\'s transparency motion had just established. This shows the immediate, same-meeting effect of that reform.',
    votes:{Brent:'Y',Crisp:'Y',Hambrick:'Y',Hampton:'Y',Menke:'Y',LusbyMitchell:'Y',TingleSames:'Y',Stone:'Y'} },

  { id:'v012', date:'Nov 24 2025', yr:'2025', motion:'GMWSS Payment — Lovo Inc. $15,900',
    mover:'Hampton', seconder:'Stone', result:'Unanimous', topic:'finance', type:'payment',
    sig:'Approved a $15,900 payment to Lovo Inc. for GMWSS work. Council approval is required for payments above the city\'s procurement threshold, providing a public check on utility spending.',
    votes:{Brent:'Y',Crisp:'Y',Hambrick:'Y',Hampton:'Y',Menke:'Y',LusbyMitchell:'Y',TingleSames:'Y',Stone:'Y'} },

  { id:'v013', date:'Nov 24 2025', yr:'2025', motion:'GMWSS Payment — Universal Solutions $33,008.40',
    mover:'Tingle Sames', seconder:'Menke', result:'Unanimous', topic:'finance', type:'payment',
    sig:'Approved a $33,008 payment to Universal Solutions for GMWSS infrastructure work. This is one of four GMWSS contractor payments totaling over $296,000 approved at this single meeting — reflecting the scale of Georgetown\'s ongoing water and sewer capital program.',
    votes:{Brent:'Y',Crisp:'Y',Hambrick:'Y',Hampton:'Y',Menke:'Y',LusbyMitchell:'Y',TingleSames:'Y',Stone:'Y'} },

  { id:'v014', date:'Nov 24 2025', yr:'2025', motion:'GMWSS Payment — Hazen $11,600',
    mover:'Tingle Sames', seconder:'Wilkins Brent', result:'Unanimous', topic:'finance', type:'payment',
    sig:'Approved an $11,600 payment to Hazen for GMWSS engineering services. Hazen is an environmental and infrastructure engineering firm; this payment likely covers design or consulting work for water or sewer projects serving Georgetown\'s growing population.',
    votes:{Brent:'Y',Crisp:'Y',Hambrick:'Y',Hampton:'Y',Menke:'Y',LusbyMitchell:'Y',TingleSames:'Y',Stone:'Y'} },

  { id:'v015', date:'Nov 24 2025', yr:'2025', motion:'GMWSS Payment — Judy Construction $236,172.45',
    mover:'Stone', seconder:'Hambrick', result:'Unanimous', topic:'finance', type:'payment',
    sig:'Approved the largest single payment of the evening — $236,172 to Judy Construction for GMWSS construction work. At nearly a quarter million dollars, this represents active water or sewer infrastructure construction, likely related to capacity expansion needed to support Georgetown\'s rapid residential development.',
    votes:{Brent:'Y',Crisp:'Y',Hambrick:'Y',Hampton:'Y',Menke:'Y',LusbyMitchell:'Y',TingleSames:'Y',Stone:'Y'} },

  { id:'v016', date:'Nov 24 2025', yr:'2025', motion:'Bulletproof Vest Partnership Grant Application',
    mover:'Lusby Mitchell', seconder:'Stone', result:'Unanimous', topic:'police', type:'grant',
    sig:'Authorized Georgetown Police to apply for the federal Bulletproof Vest Partnership (BVP) grant, which reimburses up to 50% of the cost of body armor for law enforcement officers. This is a routine officer safety measure — departments apply annually and the federal government covers half the cost of vests.',
    votes:{Brent:'Y',Crisp:'Y',Hambrick:'Y',Hampton:'Y',Menke:'Y',LusbyMitchell:'Y',TingleSames:'Y',Stone:'Y'} },

  { id:'v017', date:'Nov 24 2025', yr:'2025', motion:'Require Resumes & Service History for All Future Board Appointments',
    mover:'Hampton', seconder:'Menke', result:'Unanimous', topic:'motion', type:'policy',
    note:'Landmark transparency reform — directed city to update website with current board membership',
    sig:'A landmark governance reform requiring that any person appointed to a city board or commission must submit a resume and disclose their history of prior board service before the Council votes. Previously, appointments could be made with little public information about candidates\' qualifications. This motion also directed the city to update its website to reflect who currently sits on each board — a basic transparency step that apparently hadn\'t been done. Both new councilmembers Crisp and Menke voted yes in their first year, and the reform took immediate effect: Jeff Klocke\'s GMWSS reappointment was tabled the same evening pending the new review process.',
    votes:{Brent:'Y',Crisp:'Y',Hambrick:'Y',Hampton:'Y',Menke:'Y',LusbyMitchell:'Y',TingleSames:'Y',Stone:'Y'} },

  { id:'v018', date:'Oct 1 2025', yr:'2025', motion:'JAG Grant $147,588 — Community Recovery & Support Officers',
    mover:'', seconder:'', result:'Approved', topic:'police', type:'grant',
    sig:'Accepted $147,588 from the federal Justice Assistance Grant (JAG) program to fund two Georgetown Police officers dedicated specifically to Community Recovery and Support. These officers work with residents experiencing mental health crises and substance use issues rather than just making arrests — a community policing model aimed at reducing repeat calls and connecting people to services. The city also committed matching funds.',
    votes:{Brent:'Y',Crisp:'Y',Hambrick:'Y',Hampton:'Y',Menke:'Y',LusbyMitchell:'Y',TingleSames:'Y',Stone:'Y'} },

  { id:'v019', date:'Oct 1 2025', yr:'2025', motion:'License Plate Reader & Intersection Camera Municipal Order',
    mover:'Hampton', seconder:'', result:'Approved', topic:'police', type:'municipal-order',
    sig:'Authorized Georgetown Police to deploy License Plate Reader (LPR) cameras at intersections. LPRs automatically scan and log vehicle plates, allowing police to flag stolen vehicles or wanted persons in real time. The technology is effective for some crimes but raises civil liberties concerns about mass surveillance and data retention. Georgetown residents should know where these cameras are deployed and how long data is retained.',
    votes:{Brent:'Y',Crisp:'Y',Hambrick:'Y',Hampton:'Y',Menke:'Y',LusbyMitchell:'Y',TingleSames:'Y',Stone:'Y'} },

  { id:'v020', date:'Oct 1 2025', yr:'2025', motion:'Violence Against Women Act Grant Application',
    mover:'Lusby Mitchell', seconder:'Wilkins Brent', result:'Approved', topic:'police', type:'grant',
    sig:'Authorized Georgetown to apply for VAWA (Violence Against Women Act) federal grant funding, which supports law enforcement and victim services for domestic violence, sexual assault, and stalking cases. These funds typically pay for specialized investigators, victim advocates, or training for officers responding to domestic violence calls.',
    votes:{Brent:'Y',Crisp:'Y',Hambrick:'Y',Hampton:'Y',Menke:'Y',LusbyMitchell:'Y',TingleSames:'Y',Stone:'Y'} },

  { id:'v021', date:'Sep 22 2025', yr:'2025', motion:'Accept Airport Infrastructure Grant — Mayor Authorized to Sign',
    mover:'', seconder:'', result:'Approved', topic:'finance', type:'grant',
    sig:'Ratified acceptance of an Airport Infrastructure Grant (AIG) for the Georgetown-Scott County Regional Airport and authorized Mayor Jenkins to sign all related documents. Federal AIG funds support capital improvements at general aviation airports. The amount was not disclosed in the available minutes, but acceptance at a special meeting suggests the grant was time-sensitive.',
    votes:{Brent:'Y',Crisp:'Y',Hambrick:'Y',Hampton:'Y',Menke:'Y',LusbyMitchell:'Y',TingleSames:'Y',Stone:'Y'} },

  { id:'v022', date:'Sep 8 2025', yr:'2025', motion:'Columbia Gas Franchise Ordinance',
    mover:'Lusby Mitchell', seconder:'', result:'Passed', topic:'pw', type:'ordinance',
    note:'Hambrick and Stone excused from this meeting',
    sig:'Granted Columbia Gas of Kentucky a franchise agreement to operate natural gas distribution infrastructure within Georgetown city limits. Franchise agreements give utilities the legal right to use public rights-of-way (streets, easements) for their pipes and lines, typically in exchange for a franchise fee paid to the city. This vote directly affects natural gas rates, reliability, and infrastructure investment for Georgetown residents and businesses served by Columbia Gas.',
    votes:{Brent:'Y',Crisp:'Y',Hambrick:'X',Hampton:'Y',Menke:'Y',LusbyMitchell:'Y',TingleSames:'Y',Stone:'X'} },

  { id:'v023', date:'Sep 8 2025', yr:'2025', motion:'Traffic Study Municipal Order',
    mover:'', seconder:'', result:'Passed', topic:'pw', type:'municipal-order',
    note:'Hambrick and Stone excused',
    sig:'Accepted a traffic study analyzing road conditions and recommending improvements. Traffic studies inform decisions about signal timing, turning lanes, speed limits, and infrastructure priorities. The findings likely relate to growth-related congestion in parts of Georgetown and may form the basis for future capital projects.',
    votes:{Brent:'Y',Crisp:'Y',Hambrick:'X',Hampton:'Y',Menke:'Y',LusbyMitchell:'Y',TingleSames:'Y',Stone:'X'} },

  { id:'v024', date:'Sep 8 2025', yr:'2025', motion:'Add CAD Administrator to Personnel Ordinance',
    mover:'', seconder:'', result:'Passed', topic:'personnel', type:'ordinance',
    note:'Hambrick and Stone excused',
    sig:'Created a new staff position — CAD Administrator — in the city\'s official personnel plan. This role will manage the CAD (Computer-Aided Dispatch) system used by police and 911 dispatch, which is being migrated to a cloud platform. Creating the position in the ordinance authorizes the city to hire for it and sets its compensation range. It reflects the growing complexity of city technology infrastructure.',
    votes:{Brent:'Y',Crisp:'Y',Hambrick:'X',Hampton:'Y',Menke:'Y',LusbyMitchell:'Y',TingleSames:'Y',Stone:'X'} },

  { id:'v025', date:'Jun 24 2024', yr:'2024', motion:'Adopt FY2024-25 Annual Budget',
    mover:'', seconder:'', result:'Approved', topic:'budget', type:'budget',
    note:'Crisp and Menke not yet seated (took office Jan 2025)',
    sig:'Enacted Georgetown\'s entire financial plan for the fiscal year beginning July 1, 2024 — allocating approximately $44M in revenue across all city departments. This single vote determines city staffing levels, infrastructure investments, police and fire resources, and every other city expenditure for the year. It is the most consequential vote the Council takes annually.',
    votes:{Brent:'Y',Crisp:'X',Hambrick:'Y',Hampton:'Y',Menke:'X',LusbyMitchell:'Y',TingleSames:'Y',Stone:'Y'} },

  { id:'v026', date:'Jun 10 2024', yr:'2024', motion:'First Reading — Ordinance 2024-16 Personnel & Pay Classification',
    mover:'', seconder:'', result:'Approved', topic:'personnel', type:'ordinance',
    note:'Crisp and Menke not yet seated',
    sig:'Formally introduced the first public reading of an ordinance restructuring city employee pay classifications — the result of an independent compensation study by Management Advisory Group Inc. This is the first of two required public readings before the ordinance becomes law. The study examined how Georgetown\'s pay compares to peer cities and recommended adjustments to attract and retain qualified staff across all departments.',
    votes:{Brent:'Y',Crisp:'X',Hambrick:'Y',Hampton:'Y',Menke:'X',LusbyMitchell:'Y',TingleSames:'Y',Stone:'Y'} },

  { id:'v027', date:'Mar 22 2021', yr:'2021', motion:'Rural Road Program — Lisle Road $169,538',
    mover:'', seconder:'', result:'Approved', topic:'pw', type:'contract',
    note:'Different council composition — Crisp/Menke not yet seated',
    sig:'Committed $169,538 from Kentucky\'s Rural Secondary Road Program to resurface Lisle Road. These state-funded road improvement dollars are allocated annually to counties and municipalities. For residents on Lisle Road, this vote directly determined when their road would be resurfaced.',
    votes:{Brent:'Y',Crisp:'X',Hambrick:'Y',Hampton:'Y',Menke:'X',LusbyMitchell:'Y',TingleSames:'Y',Stone:'Y'} },

  { id:'v028', date:'Mar 22 2021', yr:'2021', motion:'Rural Road Program — Lemons Mill Road $94,626',
    mover:'', seconder:'', result:'Approved', topic:'pw', type:'contract',
    note:'Different council composition',
    sig:'Committed $94,626 from the Rural Secondary Road Program to resurface Lemons Mill Road — a companion vote to the Lisle Road project. Together these two approvals directed $264,164 in state road funds to Georgetown\'s rural road network, as presented by Casey Smith of the Kentucky Transportation Cabinet.',
    votes:{Brent:'Y',Crisp:'X',Hambrick:'Y',Hampton:'Y',Menke:'X',LusbyMitchell:'Y',TingleSames:'Y',Stone:'Y'} },

  { id:'v029', date:'Mar 23 2020', yr:'2020', motion:'COVID-19 Emergency Declaration / Proclamation of Emergency',
    mover:'', seconder:'', result:'Approved', topic:'special', type:'proclamation',
    note:'Different council composition',
    sig:'Declared a state of local emergency in response to the COVID-19 pandemic — one of the most consequential votes in Georgetown\'s recent history. This declaration activated emergency powers, allowed the city to expedite procurement of supplies and services, and enabled operational changes across all departments including police, fire, dispatch, and parks. It established the legal framework for all subsequent pandemic-related city actions.',
    votes:{Brent:'Y',Crisp:'X',Hambrick:'Y',Hampton:'Y',Menke:'X',LusbyMitchell:'Y',TingleSames:'Y',Stone:'Y'} },

  // ── Dec 22 2025 ────────────────────────────────────────────────────────────
  // Source: Georgetown News-Graphic + CitizenPortal.ai Dec 22 2025 meeting summary
  { id:'v033', date:'Dec 22 2025', yr:'2025', motion:'Seven Board & Commission Appointments — First-Time Appointees',
    mover:'', seconder:'', result:'Unanimous (voice vote)', topic:'personnel', type:'appointment', confidence:'pending',
    sig:'Council unanimously confirmed seven first-time board and commission appointments in a single voice vote: Elizabeth Knight (Board of Ethics), Kita Middleton (Human Rights Commission), Greg Gibson (GMWSS Board of Commissioners), Erin Hsu (Parks & Recreation Board), Tristin Black (Planning Commission), Michael Rath (Local Governments of Scott County Joint Code Enforcement Board), and Jonathan Mifflin (Property Valuation Board of Assessment Appeals). All seven are new appointments, not reappointments — consistent with the resume-review reform adopted at the November 24 meeting. Greg Gibson fills a GMWSS Board seat, joining Wolfe, Klocke, and Baird.',
    votes:{} },

  { id:'v034', date:'Dec 22 2025', yr:'2025', motion:'Municipal Order — City Hall Audio/Visual System $84,000',
    mover:'', seconder:'', result:'7-1 (Stone dissenting)', topic:'finance', type:'municipal-order', confidence:'pending',
    sig:'Approved the purchase and installation of a $84,000 audio/visual system for City Hall, including an overflow room setup for when council chambers reach capacity. This is the only dissenting vote at the December 22 meeting — Councilmember Stone cast the lone "no." The AV upgrade modernizes city council meeting infrastructure and provides overflow accommodations for high-attendance public meetings. Source: Georgetown News-Graphic.',
    votes:{Brent:'Y',Crisp:'Y',Hambrick:'Y',Hampton:'Y',Menke:'Y',LusbyMitchell:'Y',TingleSames:'Y',Stone:'N'} },

  { id:'v035', date:'Dec 22 2025', yr:'2025', motion:'Routine Utility Purchases — Weiser Construction ($236,290), Evoca Water Technologies ($258,041.07), Dell Server ($16,536)',
    mover:'', seconder:'', result:'Approved (voice vote)', topic:'finance', type:'payment', confidence:'pending',
    sig:'Approved three utility and technology purchases: Weiser Construction for water treatment plant maintenance ($236,290); Evoca Water Technologies sole-source ion-resin order ($258,041.07) — sole-source designation means no competitive bid was required for this specialized water treatment material; Dell server hardware ($16,536) for city IT infrastructure. Combined: ~$510,000 in routine operational spending. Source: CitizenPortal.ai Dec 22 2025 meeting summary.',
    votes:{} },

  { id:'v036', date:'Dec 22 2025', yr:'2025', motion:'$1,000,000 Reinvestment — Laddered U.S. Treasuries via Stockyards Bank',
    mover:'', seconder:'', result:'Approved (voice vote)', topic:'finance', type:'municipal-order', confidence:'pending',
    sig:'Approved reinvesting $1,000,000 of city funds in laddered U.S. Treasury securities through Stockyards Bank — the same institution used for the November 24 Stockyards Bank Reinvestment Municipal Order. Laddering means the funds mature at different intervals, giving the city regular access to liquidity while earning Treasury yields. A routine but significant treasury management decision for a city holding ~$23.6M in fund balance. Source: CitizenPortal.ai Dec 22 2025 meeting summary.',
    votes:{} },

  // Source: CitizenPortal.ai article 7176112 — "Georgetown council agrees to participate in Bluegrass Recovery Initiative after 7-1 vote"
  { id:'v030', date:'Dec 8 2025', yr:'2025', confidence:'verified',
    motion:'Participate in Bluegrass Recovery Initiative — Resolution ($5,000 local pledge)',
    mover:'', seconder:'', result:'7-1 (Menke — No)', topic:'finance', type:'municipal-order',
    sig:'Council voted 7-1 to adopt a resolution committing Georgetown to participate in the Bluegrass Recovery Initiative (BRI), a regional effort coordinating substance-use-disorder recovery services across a 17-county region. Georgetown\'s local pledge was $5,000, contingent on a larger state award. Councilmember Menke cast the sole no vote, citing concerns about timing and governance — specifically that final decisions in similar regional board structures are often made at the regional rather than local level.',
    votes:{Brent:'Y',Crisp:'Y',Hambrick:'Y',Hampton:'Y',Menke:'N',LusbyMitchell:'Y',TingleSames:'Y',Stone:'Y'} },

  // TODO: Pull full vote record from georgetownky.gov/AgendaCenter Jan 12 2026 minutes
  { id:'v031', date:'Jan 12 2026', yr:'2026', confidence:'pending',
    motion:'Ordinance 26-01 — Zone Change, 1696 Oxford Drive',
    mover:'', seconder:'', result:'Passed', topic:'pw', type:'ordinance',
    sig:'First ordinance of 2026 — rezoned property at 1696 Oxford Drive. First regular meeting of the year included organizational items for the new term. Full vote record for Jan 12 2026 pending verification from official minutes.',
    votes:{Brent:'',Crisp:'',Hambrick:'',Hampton:'',Menke:'',LusbyMitchell:'',TingleSames:'',Stone:''} },

  // TODO: Pull full vote record from georgetownky.gov/AgendaCenter Mar 9 2026 minutes
  { id:'v032', date:'Mar 9 2026', yr:'2026', confidence:'pending',
    motion:'Mar 9 2026 Regular Meeting — Full Vote Record Pending',
    mover:'', seconder:'', result:'', topic:'motion', type:'procedural',
    sig:'First 2026 regular meeting following the March 1 GMWSS rate increase ($22.90 water + $21.09 sewer, combined $43.99 — +70% vs 2022 baseline). GMWSS under public scrutiny: FOX 56 reported resident billing complaints, 15,404 active customers, 91 leak checks (36 showed flow). Full vote record pending verification from official minutes.',
    votes:{Brent:'',Crisp:'',Hambrick:'',Hampton:'',Menke:'',LusbyMitchell:'',TingleSames:'',Stone:''} },

  // TODO: Pull full vote record from georgetownky.gov/AgendaCenter Oct 27 2025 minutes — first readings of Ord. 25-30 and Ord. 25-31 (GMWSS bond ordinances) + Suffoletta Park pool addition
  { id:'v049', date:'Oct 27 2025', yr:'2025', confidence:'pending',
    motion:'Oct 27 2025 Regular Meeting — Full Vote Record Pending',
    mover:'', seconder:'', result:'', topic:'finance', type:'ordinance',
    sig:'Regular meeting at which the first readings of Ord. 25-30 (First Amended and Restated General Bond Ordinance) and Ord. 25-31 (Series 2025A $72M Water and Sewer Revenue Bond) were presented. Council also approved design funding for a Suffoletta Park pool addition. Full vote record pending verification from official minutes at georgetownky.gov/AgendaCenter.',
    votes:{Brent:'',Crisp:'',Hambrick:'',Hampton:'',Menke:'',LusbyMitchell:'',TingleSames:'',Stone:''} },

  // ── Nov 10 2025 ───────────────────────────────────────────────────────────────
  // Sources: Georgetown News-Graphic "GMWSS Bond Sale approved" + CitizenPortal.ai article 7045423
  // Ord. 25-30 (first amended bond framework) and Ord. 25-31 (Series 2025A $72M bonds) both adopted.
  // Crisp moved to table; motion to table failed; Crisp then voted No on the bond sale.
  // Tingle Sames was absent from this meeting. Bond closed Dec 9, 2025 with BofA at 4.24%.
  { id:'v038', date:'Nov 10 2025', yr:'2025', confidence:'verified',
    motion:'GMWSS $72,030,000 Bond Sale Authorization — Ordinance 25-31 (Series 2025A Water and Sewer Revenue Bond)',
    mover:'', seconder:'', result:'6-1 (Crisp — No; Tingle Sames — Absent)', topic:'finance', type:'bond',
    sig:'Authorized the sale of $72,030,000 in GMWSS Water and Sewer Revenue and Revenue Refunding Bonds (Series 2025A) — the largest single financial action taken by the Council in recent years. Bonds primarily fund the WWTP1 wastewater treatment plant expansion that Georgetown has been financing since 2022, with $10M going to additional capital needs. Total bond repayment estimated at $139,066,137 over the life of the bonds. Councilmember Crisp was the lone dissenter — his motion to table the vote for further review failed before he cast his No vote. Karen Tingle Sames was absent. The bond sale closed December 9, 2025 with BofA Securities submitting the winning bid at a 4.24% true interest cost, significantly below the projected 4.6%, generating approximately $1.8M in additional premium funding.',
    votes:{Brent:'Y',Crisp:'N',Hambrick:'Y',Hampton:'Y',Menke:'Y',LusbyMitchell:'Y',TingleSames:'X',Stone:'Y'} },

  // ── Jun 9 2025 ────────────────────────────────────────────────────────────────
  // TODO: Pull full vote record from georgetownky.gov/AgendaCenter Jun 9 2025 minutes
  { id:'v037', date:'Jun 9 2025', yr:'2025', confidence:'pending',
    motion:'Adopt FY2026 GMWSS Budget — $25,359,991 Total Revenue',
    mover:'', seconder:'', result:'Approved (voice vote)', topic:'budget', type:'budget',
    sig:'Council adopted the FY2026 GMWSS water and sewer budget by voice vote: $25,359,991 total revenue (+18.59% vs FY25). Operating expenses $24,289,856. Capital: $1,794,697 departmental + $2,650,000 Toyota-reimbursed (Fund 2). 150 new connections budgeted. Staff COLA 2.9% + up to 1% merit. ARPA deadline December 2026. Per-member vote breakdown pending verification from official minutes.',
    votes:{Brent:'',Crisp:'',Hambrick:'',Hampton:'',Menke:'',LusbyMitchell:'',TingleSames:'',Stone:''} },

  // ── 2026 stubs (Jan–Jun) ──────────────────────────────────────────────────────
  // TODO: Pull full vote record from georgetownky.gov/AgendaCenter Jan 26 2026 minutes
  { id:'v039', date:'Jan 26 2026', yr:'2026', confidence:'pending',
    motion:'Jan 26 2026 Regular Meeting — Full Vote Record Pending',
    mover:'', seconder:'', result:'', topic:'motion', type:'procedural',
    sig:'Fourth Monday January 2026 regular meeting. Full vote record pending verification from official minutes.',
    votes:{Brent:'',Crisp:'',Hambrick:'',Hampton:'',Menke:'',LusbyMitchell:'',TingleSames:'',Stone:''} },

  // TODO: Pull full vote record from georgetownky.gov/AgendaCenter Feb 9 2026 minutes
  { id:'v040', date:'Feb 9 2026', yr:'2026', confidence:'pending',
    motion:'Feb 9 2026 Regular Meeting — Full Vote Record Pending',
    mover:'', seconder:'', result:'', topic:'motion', type:'procedural',
    sig:'Second Monday February 2026 regular meeting. Full vote record pending verification from official minutes.',
    votes:{Brent:'',Crisp:'',Hambrick:'',Hampton:'',Menke:'',LusbyMitchell:'',TingleSames:'',Stone:''} },

  // TODO: Pull full vote record from georgetownky.gov/AgendaCenter Feb 23 2026 minutes
  { id:'v041', date:'Feb 23 2026', yr:'2026', confidence:'pending',
    motion:'Feb 23 2026 Regular Meeting — Full Vote Record Pending',
    mover:'', seconder:'', result:'', topic:'motion', type:'procedural',
    sig:'Fourth Monday February 2026 regular meeting. Full vote record pending verification from official minutes.',
    votes:{Brent:'',Crisp:'',Hambrick:'',Hampton:'',Menke:'',LusbyMitchell:'',TingleSames:'',Stone:''} },

  // TODO: Pull full vote record from georgetownky.gov/AgendaCenter Mar 23 2026 minutes
  { id:'v042', date:'Mar 23 2026', yr:'2026', confidence:'pending',
    motion:'Mar 23 2026 Regular Meeting — Full Vote Record Pending',
    mover:'', seconder:'', result:'', topic:'motion', type:'procedural',
    sig:'Fourth Monday March 2026 regular meeting, following the March 1 GMWSS rate increase. Full vote record pending verification from official minutes.',
    votes:{Brent:'',Crisp:'',Hambrick:'',Hampton:'',Menke:'',LusbyMitchell:'',TingleSames:'',Stone:''} },

  // TODO: Pull full vote record from georgetownky.gov/AgendaCenter Apr 13 2026 minutes
  { id:'v043', date:'Apr 13 2026', yr:'2026', confidence:'pending',
    motion:'Apr 13 2026 Regular Meeting — Full Vote Record Pending',
    mover:'', seconder:'', result:'', topic:'motion', type:'procedural',
    sig:'Second Monday April 2026 regular meeting. Full vote record pending verification from official minutes.',
    votes:{Brent:'',Crisp:'',Hambrick:'',Hampton:'',Menke:'',LusbyMitchell:'',TingleSames:'',Stone:''} },

  // TODO: Pull full vote record from georgetownky.gov/AgendaCenter Apr 27 2026 minutes
  { id:'v044', date:'Apr 27 2026', yr:'2026', confidence:'pending',
    motion:'Apr 27 2026 Regular Meeting — Full Vote Record Pending',
    mover:'', seconder:'', result:'', topic:'motion', type:'procedural',
    sig:'Fourth Monday April 2026 regular meeting. Full vote record pending verification from official minutes.',
    votes:{Brent:'',Crisp:'',Hambrick:'',Hampton:'',Menke:'',LusbyMitchell:'',TingleSames:'',Stone:''} },

  // TODO: Pull full vote record from georgetownky.gov/AgendaCenter May 11 2026 minutes
  { id:'v045', date:'May 11 2026', yr:'2026', confidence:'pending',
    motion:'May 11 2026 Regular Meeting — Full Vote Record Pending',
    mover:'', seconder:'', result:'', topic:'motion', type:'procedural',
    sig:'Second Monday May 2026 regular meeting — last regular meeting before the May 19 primary election. Full vote record pending verification from official minutes.',
    votes:{Brent:'',Crisp:'',Hambrick:'',Hampton:'',Menke:'',LusbyMitchell:'',TingleSames:'',Stone:''} },

  // TODO: Pull full vote record from georgetownky.gov/AgendaCenter May 18 2026 special meeting minutes
  { id:'v046', date:'May 18 2026', yr:'2026', confidence:'pending',
    motion:'May 18 2026 Special Meeting — Full Vote Record Pending',
    mover:'', seconder:'', result:'', topic:'motion', type:'procedural',
    sig:'Special meeting held the evening before the May 19 2026 primary election at Scott County Fiscal Court Room. Full vote record pending verification from official minutes.',
    votes:{Brent:'',Crisp:'',Hambrick:'',Hampton:'',Menke:'',LusbyMitchell:'',TingleSames:'',Stone:''} },

  // TODO: Pull full vote record from georgetownky.gov/AgendaCenter Jun 22 2026 minutes — FY2026-27 budget adoption expected (proposed $47.1M general fund revenue per May 12 workshop)
  { id:'v048', date:'Jun 22 2026', yr:'2026', confidence:'pending',
    motion:'Jun 22 2026 Regular Meeting — Full Vote Record Pending',
    mover:'', seconder:'', result:'', topic:'budget', type:'budget',
    sig:'Fourth Monday regular meeting. FY2026-27 budget adoption is anticipated at this meeting, consistent with prior-year pattern (FY2025-26 adopted June 23, 2025). Mayor Jenkins proposed ~$47.1M general fund revenue (+7% vs FY26) at the May 12 budget workshop. Full vote record pending verification from official minutes at georgetownky.gov/AgendaCenter.',
    votes:{Brent:'',Crisp:'',Hambrick:'',Hampton:'',Menke:'',LusbyMitchell:'',TingleSames:'',Stone:''} },

  // TODO: Pull full vote record from georgetownky.gov/AgendaCenter Jun 8 2026 minutes
  { id:'v047', date:'Jun 8 2026', yr:'2026', confidence:'pending',
    motion:'Jun 8 2026 Regular Meeting — Full Vote Record Pending',
    mover:'', seconder:'', result:'', topic:'motion', type:'procedural',
    sig:'First regular meeting following the May 19 2026 primary election. Jenkins v. Menke advance to the November 3 general election for Mayor; 16 council candidates advance. Full vote record pending verification from official minutes.',
    votes:{Brent:'',Crisp:'',Hambrick:'',Hampton:'',Menke:'',LusbyMitchell:'',TingleSames:'',Stone:''} },
];
