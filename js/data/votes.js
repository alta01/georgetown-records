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
];
