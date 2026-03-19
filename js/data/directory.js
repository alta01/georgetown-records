export const IMG = id => `https://www.georgetownky.gov/ImageRepository/Document?documentID=${id}`;

export const DEPTS = [
  { id:'mayors-office', name:"Mayor's Office", phone:'502-863-9800', icon:'🏛️', icoc:'di-gd', group:'leadership',
    desc:'Chief executive of Georgetown. Mayor Jenkins presides over Council, administers budget, oversees all departments.',
    members:[{
      name:'Burney Jenkins', ini:'BJ', av:'av-gd', title:'Mayor', tags:['t-mayor'],
      ph:'502-863-9800', f:'verified', photo:IMG(2203), email:'mayor@georgetownky.gov',
      notes:'First Black mayor elected in Georgetown history (Nov 2022). Educator and coach for 46 years. 25 years with Georgetown Parks & Rec.',
      bio:'Burney Jenkins was elected Mayor of Georgetown in November 2022 — the first Black man elected to the position. A Georgetown native and lifelong educator who taught for 46 years and spent 25 years with Georgetown Parks & Recreation, he defeated longtime councilmember David Lusby with 58.7% of the vote. He oversees 245 full-time employees, a ~$44M general fund, and has led City Hall renovation, CAD cloud migration, police expansion, and the Georgetown250 anniversary initiative.',
      positionSummary:'The Mayor is the chief executive officer of Georgetown under Kentucky\'s mayor-council form. Responsibilities include preparing and administering the annual budget, presiding at City Council meetings, appointing city officers and board members, executing all bonds and contracts, delivering the annual State of the City address, approving or vetoing ordinances, and serving as liaison to regional governments.',
      socials:[{ platform:'City Facebook', url:'https://www.facebook.com/CityofGeorgetownKY', label:'City of Georgetown', icon:'f' }],
      events:[
        { date:'Dec 8 2025', text:'Presided over final 2025 council meeting. Georgetown250 anniversary proclamation discussed; $5,000 pledged to Bluegrass Recovery Initiative.', url:'https://www.georgetownky.gov/AgendaCenter', summary:'The December 8 regular meeting was the last of 2025. Mayor Jenkins presided as Fire Chief Johnson presented smoke detector giveaway events, the Georgetown250 anniversary committee gave updates, and the Council pledged $5,000 to the Bluegrass Recovery Initiative for mental health and substance use support services.' },
        { date:'Nov 24 2025', text:'Removed two Board of Ethics reappointments from the agenda before the meeting opened.', url:'https://www.georgetownky.gov/AgendaCenter/ViewFile/Minutes/_11242025-293', summary:'Before the November 24 meeting began, Mayor Jenkins pulled two proposed Board of Ethics reappointments from the agenda — the reasons were not detailed in the minutes. The remaining Ethics Board reappointments (Causey-Upton and Cozzi) proceeded and were unanimously approved. The pulled reappointments left at least two Ethics Board seats in question.' },
        { date:'Oct 2025', text:'State of the City: 245 FT employees, ~$23.6M fund balance, FY25 deficit reduced to ~$1.5M vs $7.2M budgeted.', url:'https://www.georgetownky.gov/AgendaCenter', summary:'In his annual State of the City address, Mayor Jenkins reported Georgetown employs 245 full-time and 10 part-time staff. The general fund balance stood at ~$23.6M as of June 30. The projected FY25 deficit of ~$1.5M represented a major improvement over the $7.2M deficit originally budgeted — a $5.7M favorable swing attributed to improved revenue collections and expenditure controls.' },
        { date:'Sep 22 2025', text:'Authorized to sign all Airport Infrastructure Grant documents.', url:'https://www.georgetownky.gov/AgendaCenter/ViewFile/Minutes/_09222025-235', summary:'At a special session called specifically to ratify the Airport Infrastructure Grant, the Council authorized Mayor Jenkins to execute all grant documents on behalf of the city. The AIG provides federal funds for capital improvements at the Georgetown-Scott County Regional Airport. The special meeting indicates the grant acceptance was time-sensitive.' },
      ],
      stats:[{ val:'2023', lbl:'Took Office' },{ val:'245', lbl:'FT Employees' },{ val:'~$44M', lbl:'Annual Budget' }]
    }]},

  { id:'cao', name:'Chief Administrative Officer', phone:'502-863-9800 ext.9', icon:'📋', icoc:'di-gd', group:'leadership',
    desc:'Day-to-day city operations, budgets, and personnel under direction of Mayor.',
    members:[{
      name:'Devon Golden', ini:'DG', av:'av-gd', title:'Chief Administrative Officer',
      tags:['t-legal','t-admin'], ph:'502-863-9800 ext.9', f:'verified',
      email:'dgolden@georgetownky.gov',
      notes:'Promoted from City Attorney to CAO March 2023. Georgetown College 2013, NKU Chase Law 2016.',
      bio:'Devon Golden was promoted from City Attorney to Chief Administrative Officer in March 2023 by Mayor Jenkins. A Georgetown College alumna (2013) and NKU Chase Law graduate (2016), she previously served as assistant to CAO Andrew Hartley before becoming City Attorney in 2019. She also served as attorney to the Georgetown-Scott County Revenue Commission. As CAO she manages all day-to-day city operations, budget administration, and coordinates the senior management team.',
      positionSummary:'The CAO is appointed by the Mayor with Council approval. Manages daily city operations, supervises department heads, implements Council policy, oversees budget execution, and serves as the Mayor\'s primary deputy.',
      socials:[], events:[
        { date:'Nov 24 2025', text:'Provided status update on boards and commissions accepting applications through Nov 28, 2025.', url:'https://www.georgetownky.gov/AgendaCenter/ViewFile/Minutes/_11242025-293', summary:'CAO Golden briefed the Council on which boards had open vacancies and were accepting applications through November 28. This update came at the same meeting where Councilmember Hampton\'s landmark transparency motion — requiring resumes for all board appointments — passed unanimously, a reform Golden\'s office will now administer.' },
        { date:'Mar 2023', text:'Promoted from City Attorney to CAO by Mayor Jenkins.', url:'https://www.news-graphic.com/news/mayor-promotes-golden-to-city-cao/article_85d6785c-bee4-11ed-b73a-c7792873807f.html', summary:'Mayor Jenkins announced Devon Golden\'s promotion from City Attorney to CAO in March 2023, replacing Andrew Hartley. Golden had served as City Attorney since 2019 after assisting Hartley. Her promotion triggered a search for a new City Attorney, resulting in Emilee Buttrum\'s appointment. The CAO role had been somewhat controversial since its creation by former Mayor Prather in 2019.' },
      ], stats:[{ val:'2019', lbl:'Joined City' },{ val:'2023', lbl:'Became CAO' }]
    }]},

  { id:'city-attorney', name:"City Attorney's Office", phone:'502-863-9800 ext.9', icon:'⚖️', icoc:'di-t', group:'legal',
    desc:'Legal counsel for the City. Reviews ordinances, municipal orders, and contracts.',
    members:[{
      name:'Emilee A. Buttrum', ini:'EB', av:'av-t', title:'City Attorney',
      tags:['t-legal'], ph:'502-863-9800 ext.9', f:'verified',
      notes:'Certified numerous ordinances and orders 2024–2025. Succeeded Devon Golden.',
      bio:'Emilee A. Buttrum, Esq. serves as City Attorney for Georgetown, appointed after Devon Golden\'s promotion to CAO in 2023. She has certified multiple municipal ordinances and orders including Ordinance 2024-16 and the Columbia Gas Franchise Ordinance.',
      positionSummary:'City Attorney provides chief legal counsel. Reviews ordinances and municipal orders, advises Council on legal matters, represents the city in litigation, reviews contracts, and certifies official documents.',
      socials:[], events:[
        { date:'Sep 8 2025', text:'Certified the Columbia Gas Franchise Ordinance as legally sufficient.', url:'https://www.georgetownky.gov/AgendaCenter', summary:'City Attorney Buttrum formally certified the Columbia Gas Franchise Ordinance — sponsored by Councilmember Lusby Mitchell — as legally compliant before its passage at the September 8, 2025 regular meeting. This certification is a required step before any ordinance can take effect, confirming the measure meets all applicable Kentucky statutes and city code requirements.' },
        { date:'Jun 2024', text:'Certified Ordinance 2024-16, Personnel and Pay Classification Plan amendment.', url:'https://www.georgetownky.gov/DocumentCenter/View/2748', summary:'Attorney Buttrum certified the legal sufficiency of Ordinance 2024-16, which amended Georgetown\'s Personnel and Pay Classification Plan following a Compensation Study by Management Advisory Group Inc. The ordinance restructured city employee pay grades to better align with peer cities and help attract and retain qualified staff across all departments.' },
      ], stats:[]
    }]},

  { id:'city-clerk', name:'City Clerk – Treasurer', phone:'502-863-9800', icon:'📄', icoc:'di-x', group:'admin',
    desc:'Custodian of all official records, minutes, agendas, and ordinances.',
    members:[{
      name:'Tracie Hoffman', ini:'TH', av:'av-t', title:'City Clerk-Treasurer',
      tags:['t-admin'], ph:'502-863-9800', f:'verified',
      notes:'Attests and certifies all City Council meeting minutes.',
      bio:'Tracie Hoffman serves as City Clerk-Treasurer, the custodian of all official city records including ordinances, municipal orders, and meeting minutes. She attests and certifies all City Council meeting minutes and manages the city\'s Open Records Request process.',
      positionSummary:'Custodian of all official city records. Prepares and publishes agendas, maintains accurate Council meeting minutes, handles Open Records Requests, and manages city treasury functions.',
      socials:[], events:[
        { date:'Nov 24 2025', text:'Attested and certified the November 24 City Council meeting minutes.', url:'https://www.georgetownky.gov/AgendaCenter/ViewFile/Minutes/_11242025-293', summary:'As City Clerk-Treasurer, Tracie Hoffman officially attested and certified the minutes of the November 24, 2025 City Council meeting — a 3-page document covering 17 voted motions including the landmark board appointment transparency reform and six board/commission reappointments. Her signature makes the minutes the official legal record of that session.' },
      ], stats:[]
    }]},

  { id:'city-council', name:'City Council', phone:'502-863-9800', icon:'⚖️', icoc:'di-g', group:'leadership',
    desc:'Eight at-large members. Legislative body. Meets 2nd & 4th Mondays 6pm, 100 N Court Street.',
    members:[
      { name:'Sonja Wilkins Brent', ini:'SW', av:'av-g', title:'City Councilmember', tags:['t-council'],
        ph:'859-412-2241', f:'verified', photo:IMG(2052), email:'sbrent@georgetownky.gov',
        notes:'Administrative assistant with Scott County Attorney\'s Office since 2004. Elected 2022.',
        bio:'Sonja Wilkins Brent is an at-large Georgetown City Councilmember elected in 2022. She works as an administrative assistant with the Scott County Attorney\'s Office. In November 2025 she voluntarily recused herself from the April Baker Human Rights Commission reappointment vote due to a family member conflict of interest.',
        positionSummary:'At-large City Councilmember. As part of the 8-member legislative body, adopts the annual budget, levies taxes and fees, enacts local ordinances, and appoints members to boards and commissions.',
        socials:[], events:[
          { date:'Nov 24 2025', text:'Recused from Human Rights Commission vote (April Baker) — family conflict. Voted on all other items.', url:'https://www.georgetownky.gov/AgendaCenter/ViewFile/Minutes/_11242025-293', summary:'Councilmember Wilkins Brent voluntarily recused herself from the vote on April Baker\'s Human Rights Commission reappointment due to a family member conflict of interest. The motion passed 7-0 with her recusal. She participated fully in all other 16 votes at the November 24 meeting, including seconding the Gui Cozzi Board of Ethics reappointment and the Hazen GMWSS payment.' },
          { date:'Nov 24 2025', text:'Seconded Gui Cozzi Board of Ethics reappointment and Hazen $11,600 GMWSS payment.', url:'https://www.georgetownky.gov/AgendaCenter/ViewFile/Minutes/_11242025-293', summary:'At the November 24 meeting, Councilmember Wilkins Brent seconded two motions: Gui Cozzi\'s reappointment to the Board of Ethics (moved by Stone, passed unanimously) and the $11,600 payment to Hazen engineering for GMWSS work (moved by Tingle Sames, passed unanimously). These were among 17 motions voted on that evening.' },
        ], stats:[{ val:'2022', lbl:'Elected' },{ val:'At-Large', lbl:'Seat Type' }]
      },
      { name:'Michael Crisp', ini:'MC', av:'av-g', title:'City Councilmember', tags:['t-council'],
        ph:'859-509-0494', f:'new', photo:IMG(3152), email:'mcrisp@georgetownky.gov',
        notes:'New term Jan 2025. Sponsored County Priority Projects grant resolution.',
        bio:'Michael Crisp was elected to the Georgetown City Council and took his oath of office on January 27, 2025. He quickly became active on grant matters, sponsoring a County Priority Projects grant resolution for resurfacing of Delaplain Road and Main Avenue.',
        positionSummary:'At-large City Councilmember (new term Jan 2025). Adopts the annual budget, levies taxes and fees, enacts local ordinances, and appoints members to boards and commissions.',
        socials:[], events:[
          { date:'Jan 27 2025', text:'Sworn into office at special organizational meeting.', url:'https://www.georgetownky.gov/AgendaCenter/ViewFile/Minutes/_01272025-175', summary:'Michael Crisp and Kim Menke were sworn in as the two newest members of Georgetown City Council at the January 27, 2025 special organizational meeting. Both were newly elected in the November 2024 general election. Their oaths initiated a new term and set the stage for organizational matters including committee assignments for the 2025-2026 term.' },
          { date:'2025', text:'Moved to add County Priority Projects Program grant resolution to the Oct 1 agenda.', url:'https://www.georgetownky.gov/AgendaCenter/ViewFile/Agenda/_10012025-263', summary:'At the October 1 regular meeting, Councilmember Crisp moved to add a County Priority Projects Program grant resolution to the agenda — covering resurfacing of Delaplain Road and Main Avenue. The motion to add the item was seconded by Councilmember Tingle Sames and approved unanimously, showing Crisp actively engaged in infrastructure grant opportunities within his first year in office.' },
        ], stats:[{ val:'Jan 2025', lbl:'Took Office' },{ val:'At-Large', lbl:'Seat Type' }]
      },
      { name:'Willow Hambrick', ini:'WH', av:'av-g', title:'City Councilmember', tags:['t-council'],
        ph:'502-542-0399', f:'verified', photo:IMG(2054), email:'whambrick@georgetownky.gov',
        notes:'Active on board appointments and regional committee matters.',
        bio:'Willow Hambrick is an at-large Georgetown City Councilmember who has been consistently active in board appointment votes and regional committee matters. She seconded multiple board reappointments in November 2025 and was excused from the September 8, 2025 regular meeting.',
        positionSummary:'At-large City Councilmember. Adopts the annual budget, levies taxes and fees, enacts local ordinances, and appoints members to boards and commissions.',
        socials:[{ platform:'Facebook', url:'https://www.facebook.com/p/Willow-Hambrick-for-Georgetown-City-Council-100037322333415/', label:'Willow Hambrick for Georgetown City Council', icon:'f' }], events:[
          { date:'Nov 24 2025', text:'Seconded Board of Adjustment reappointment of Virginia Teague; GMWSS reappointments of Jason Baird and Kent Chandler; Housing Authority reappointment of Patricia Harman.', url:'https://www.georgetownky.gov/AgendaCenter/ViewFile/Minutes/_11242025-293', summary:'Councilmember Hambrick was among the most active movers and seconders at the November 24 meeting. She seconded the Board of Adjustment reappointment of Virginia Teague (passed unanimously), and both the Jason Baird reappointment and new Kent Chandler appointment to GMWSS (both passed unanimously). She also seconded Patricia Harman\'s Housing Authority reappointment (unanimous) and the Judy Construction $236,172 GMWSS payment.' },
          { date:'Sep 8 2025', text:'Excused from regular meeting.', url:'https://www.georgetownky.gov/AgendaCenter', summary:'Councilmember Hambrick was excused from the September 8, 2025 regular meeting — the session at which the Columbia Gas Franchise Ordinance passed and the CAD Administrator position was added to the Personnel Ordinance. With both Hambrick and Stone excused, those votes passed 6-0 on the six members present.' },
        ], stats:[{ val:'At-Large', lbl:'Seat Type' }]
      },
      { name:'Greg Hampton', ini:'GH', av:'av-g', title:'City Councilmember', tags:['t-council'],
        ph:'859-396-3179', f:'verified', photo:IMG(2050), email:'ghampton@georgetownky.gov',
        notes:'Led landmark transparency motion requiring resumes for all board appointments — Nov 2025.',
        bio:'Greg Hampton is an at-large Georgetown City Councilmember recognized for reform-oriented governance. In November 2025 he led a unanimous motion requiring all future board appointment candidates to provide resumes and disclose prior board service history — a significant transparency reform. He also called for updating the city website to reflect current board membership.',
        positionSummary:'At-large City Councilmember. Known for board appointment transparency reform (Nov 2025). Adopts the annual budget, levies taxes and fees, enacts local ordinances, and appoints members to boards and commissions.',
        socials:[
          { platform:'X / Twitter', url:'https://x.com/chefhampton', label:'@chefHampton', icon:'𝕏' },
          { platform:'Facebook', url:'https://www.facebook.com/people/Re-Elect-Greg-Hampton-for-Georgetown-City-Council/100067851228354/', label:'Re-Elect Greg Hampton', icon:'f' }
        ], events:[
          { date:'Nov 24 2025', text:'Made motion requiring resumes and service history for all board appointments (Hampton/Menke). Passed unanimously. Called for city website update to reflect current board membership.', url:'https://www.georgetownky.gov/AgendaCenter/ViewFile/Minutes/_11242025-293', summary:'Councilmember Hampton\'s November 24 motion established that all future Georgetown board appointment candidates must submit resumes and disclose prior board service history before the Council votes. He also called for the city website to be updated to accurately reflect current board membership — a basic transparency measure that had apparently not been consistently maintained. The motion passed unanimously and took immediate effect: Jeff Klocke\'s GMWSS reappointment was tabled at the same meeting pending the new review process.' },
          { date:'Nov 24 2025', text:'Seconded Stockyards Bank Reinvestment MO and BVP Grant applications.', url:'https://www.georgetownky.gov/AgendaCenter/ViewFile/Minutes/_11242025-293', summary:'Councilmember Hambrick was excused from the September 8 meeting but was present and active on November 24. At that meeting she seconded both the Stockyards Bank Reinvestment Municipal Order (moved by Lusby Mitchell, unanimous) and the Bulletproof Vest Partnership Grant application (moved by Lusby Mitchell, seconded by Stone and also supported by Hambrick in discussion). She also moved or seconded multiple board appointment votes at the same session.' },
        ], stats:[{ val:'At-Large', lbl:'Seat Type' },{ val:'Nov 2025', lbl:'Transparency Reform' }]
      },
      { name:'Kim Menke', ini:'KM', av:'av-g', title:'City Councilmember', tags:['t-council'],
        ph:'502-503-3740', f:'new', photo:IMG(3154), email:'kmenke@georgetownky.gov',
        notes:'New term Jan 2025. Seconded board appointment transparency motion.',
        bio:'Kim Menke was elected to the Georgetown City Council and took her oath of office on January 27, 2025. She quickly established herself as active on governance matters, seconding Greg Hampton\'s landmark motion requiring resumes for all board appointments, and taking a lead role in GMWSS commissioner appointments.',
        positionSummary:'At-large City Councilmember (new term Jan 2025). Adopts the annual budget, levies taxes and fees, enacts local ordinances, and appoints members to boards and commissions.',
        socials:[], events:[
          { date:'Jan 27 2025', text:'Sworn into office at special organizational meeting.', url:'https://www.georgetownky.gov/AgendaCenter/ViewFile/Minutes/_01272025-175', summary:'Michael Crisp and Kim Menke were sworn in as the two newest members of Georgetown City Council at the January 27, 2025 special organizational meeting. Both were newly elected in the November 2024 general election. Their oaths initiated a new term and set the stage for organizational matters including committee assignments for the 2025-2026 term.' },
          { date:'Nov 24 2025', text:'Seconded Hampton\'s resume requirement motion. Made motions for GMWSS reappointments (Baird, Chandler) and Housing Authority (Harman) reappointment.' },
        ], stats:[{ val:'Jan 2025', lbl:'Took Office' },{ val:'At-Large', lbl:'Seat Type' }]
      },
      { name:'Tammy Lusby Mitchell', ini:'TL', av:'av-g', title:'City Councilmember', tags:['t-council'],
        ph:'859-489-3484', f:'verified', photo:IMG(3158), email:'tlmitchell@georgetownky.gov',
        notes:'Sponsored Columbia Gas Franchise Ordinance Sep 2025. Active on finance and planning.',
        bio:'Tammy Lusby Mitchell is an at-large Georgetown City Councilmember who has taken a prominent role in infrastructure and planning matters. She sponsored the Columbia Gas Franchise Ordinance in September 2025, and moved to have the Planning & Zoning Advisory Committee submit its final recommendations and disband to allow a larger, more representative committee to form.',
        positionSummary:'At-large City Councilmember. Known for sponsoring the 2025 Columbia Gas Franchise Ordinance and P&Z Advisory Committee restructuring. Adopts the annual budget, levies taxes and fees, and enacts local ordinances.',
        socials:[], events:[
          { date:'Nov 24 2025', text:'Moved to have P&Z Advisory Committee submit recommendations at Jan 12 2026 meeting and disband. Passed unanimously.', url:'https://www.georgetownky.gov/AgendaCenter/ViewFile/Minutes/_11242025-293', summary:'Councilmember Lusby Mitchell moved to have the Planning & Zoning Advisory Committee — formed to review zoning ordinance reform — submit its final recommendations at the January 12, 2026 Council meeting and then disband. In its place, she called for a larger, more representative committee comprising Council members, Planning Commission members, and community representatives. The motion was seconded by Menke and passed unanimously. This restructuring was a significant step in Georgetown\'s ongoing Comprehensive Plan implementation.' },
          { date:'Sep 8 2025', text:'Sponsored Columbia Gas Franchise Ordinance — passed.', url:'https://www.georgetownky.gov/AgendaCenter', summary:'The Columbia Gas Franchise Ordinance sponsored by Councilmember Lusby Mitchell passed at the September 8, 2025 regular meeting. The ordinance grants Columbia Gas of Kentucky the legal right to operate natural gas distribution infrastructure within Georgetown city limits using public rights-of-way, typically in exchange for a franchise fee paid to the city. This directly affects natural gas rates, infrastructure investment, and service standards for Georgetown residents.' },
          { date:'Nov 24 2025', text:'Made motions on Stockyards Bank MO and BVP Grant; seconded Frank Allen Board of Adjustment reappointment.', url:'https://www.georgetownky.gov/AgendaCenter/ViewFile/Minutes/_11242025-293', summary:'At the November 24 meeting, Councilmember Lusby Mitchell moved the Stockyards Bank Reinvestment Municipal Order (seconded by Hampton, unanimous) and the Bulletproof Vest Partnership Grant application (seconded by Stone, unanimous). She also seconded the Frank Allen Board of Adjustment reappointment (moved by Stone, unanimous). In the same meeting she led the P&Z Advisory Committee restructuring motion.' },
        ], stats:[{ val:'At-Large', lbl:'Seat Type' },{ val:'Sep 2025', lbl:'Columbia Gas Ord.' }]
      },
      { name:'Karen Tingle Sames', ini:'KT', av:'av-g', title:'City Councilmember', tags:['t-council'],
        ph:'502-867-3254', f:'verified', photo:IMG(3168), email:'ktinglesames@georgetownky.gov',
        notes:'Reported on P&Z Advisory Committee Nov 2025. Tabled Jeff Klocke GMWSS reappointment.',
        bio:'Karen Tingle Sames is an at-large Georgetown City Councilmember active in planning and zoning matters. She reported on the Planning & Zoning Advisory Committee\'s November 2025 meetings to the full Council, and introduced the subsidiary motion to table the Jeff Klocke GMWSS reappointment to December 8 for further consideration.',
        positionSummary:'At-large City Councilmember. Active on planning, zoning, and regional utility governance. Adopts the annual budget, levies taxes and fees, and enacts local ordinances.',
        socials:[], events:[
          { date:'Nov 24 2025', text:'Reported on P&Z Advisory Committee November meetings. Introduced subsidiary motion to table Jeff Klocke GMWSS reappointment to Dec 8 — passed unanimously.', url:'https://www.georgetownky.gov/AgendaCenter/ViewFile/Minutes/_11242025-293', summary:'Councilmember Tingle Sames provided a formal report to the full Council on the Planning & Zoning Advisory Committee\'s November 2025 activities, keeping all members informed on the committee\'s progress. She then introduced the subsidiary motion — seconded by Wilkins Brent — to table Jeff Klocke\'s GMWSS reappointment to December 8, citing the need for additional review under the new resume-requirement process Hampton\'s motion had just established.' },
        ], stats:[{ val:'At-Large', lbl:'Seat Type' }]
      },
      { name:'Todd Stone', ini:'TS', av:'av-g', title:'City Councilmember', tags:['t-council'],
        ph:'502-370-7677', f:'verified', photo:IMG(2053), email:'tstone@georgetownky.gov',
        notes:'Active in board and commission appointments. Led Nov 2025 ethics and adjustment motions.',
        bio:'Todd Stone is an at-large Georgetown City Councilmember particularly active in board and commission appointments. In November 2025 he moved the reappointments of Frank Allen to the Board of Adjustment, Renee Causey-Upton to the Board of Ethics, and April Baker to the Human Rights Commission.',
        positionSummary:'At-large City Councilmember. Known for active participation in board appointment and ethics governance. Adopts the annual budget, levies taxes and fees, and enacts local ordinances.',
        socials:[], events:[
          { date:'Nov 24 2025', text:'Made motions: Frank Allen (Board of Adjustment), Renee Causey-Upton (Board of Ethics), April Baker (Human Rights Commission). Seconded Gui Cozzi Board of Ethics, GMWSS Lovo Inc. payment.', url:'https://www.georgetownky.gov/AgendaCenter/ViewFile/Minutes/_11242025-293', summary:'Councilmember Stone was the primary mover of three board appointment motions at the November 24 meeting: Frank Allen to the Board of Adjustment (seconded by Lusby Mitchell, unanimous), Renee Causey-Upton to the Board of Ethics (seconded by Hampton, unanimous), and April Baker to the Human Rights Commission (seconded by Hampton, 7-0 with Wilkins Brent recused). He also seconded the Gui Cozzi Ethics reappointment and the Lovo Inc. GMWSS payment.' },
        ], stats:[{ val:'At-Large', lbl:'Seat Type' }]
      },
    ]},

  { id:'finance', name:'Finance Department', phone:'502-863-9800', icon:'💰', icoc:'di-gd', group:'admin',
    desc:'~$44M general fund. Accounting, payroll, AP, and quarterly reporting to Council.',
    members:[{
      name:'Stacey Clark, CPA', ini:'SC', av:'av-gd', title:'Director of Finance',
      tags:['t-finance'], ph:'502-863-9800', f:'verified',
      notes:'Presented quarterly update Nov 24 2025. Fund balance ~$23.6M. Projected deficit ~$1.5M.',
      bio:'Stacey Clark, CPA serves as Director of Finance for Georgetown. She manages the city\'s ~$44M general fund, financial reporting, payroll, and accounts payable, presenting quarterly financial updates to City Council.',
      positionSummary:'Finance Director manages all city financial operations: budget execution, accounting, payroll, accounts payable, and quarterly financial reporting to City Council.',
      socials:[], events:[
        { date:'Nov 24 2025', text:'Presented quarterly financial update. Fund balance ~$23.6M as of Jun 30. FY25 projected deficit ~$1.5M vs $7.2M originally budgeted — a $5.7M improvement.', url:'https://www.georgetownky.gov/AgendaCenter/ViewFile/Minutes/_11242025-293', summary:'Finance Director Clark\'s quarterly presentation to the November 24 Council meeting revealed the general fund balance at approximately $23.6M as of June 30, and a projected FY25 deficit of only ~$1.5M — down dramatically from the $7.2M deficit originally budgeted. This $5.7M favorable variance is a significant positive indicator of Georgetown\'s fiscal health and reflects tight expenditure management across all departments.' },
      ], stats:[{ val:'~$44M', lbl:'General Fund' },{ val:'$23.6M', lbl:'Fund Balance' },{ val:'CPA', lbl:'Credential' }]
    }]},

  { id:'police', name:'Georgetown Police Department', phone:'502-863-7826', icon:'🚔', icoc:'di-b', group:'police',
    desc:'Full-service agency. JAG Recovery Support Team, CID, Traffic, Special Operations.',
    members:[
      { name:'Darin Allgood', ini:'DA', av:'av-b', title:'Chief of Police', tags:['t-police'],
        ph:'502-863-7826', f:'verified',
        notes:'Appointed Jan 13 2023. GPD since 2012. FBI National Academy Class 284.',
        bio:'Darin Allgood was appointed Georgetown\'s Chief of Police on January 13, 2023 by Mayor Jenkins. He has served with GPD since 2012, holding roles including patrol officer, detective, sergeant, CIS lieutenant, captain, and assistant chief. He holds an MS in Safety, Security, and Emergency Management from EKU, is an FBI National Academy Class 284 graduate, and teaches at Georgetown College and EKU as an adjunct professor.',
        positionSummary:'Chief of Police leads GPD\'s sworn officers and civilian staff. Sets department policy, manages the police budget, oversees specialized units (CID, Special Operations, Traffic, Recovery Support), and coordinates with federal and state law enforcement partners.',
        socials:[], events:[
          { date:'Oct 1 2025', text:'$147,588 JAG grant approved for Community Recovery & Support officers under his command.', url:'https://www.georgetownky.gov/AgendaCenter/ViewFile/Agenda/_10012025-263', summary:'The Justice Assistance Grant of $147,588 was approved by City Council at the October 1 meeting to fund two Georgetown Police officers dedicated to Community Recovery and Support — a community policing model focused on mental health crises and substance use. Chief Allgood\'s department applied for the grant and manages the program. The city also committed matching funds. This is a continuation of an existing grant program.' },
          { date:'Oct 1 2025', text:'LPR/Intersection Camera Municipal Order approved.', url:'https://www.georgetownky.gov/AgendaCenter/ViewFile/Agenda/_10012025-263', summary:'The October 1 Municipal Order authorizing License Plate Reader cameras at Georgetown intersections was passed by Council. These cameras automatically log vehicle plates in real time, helping police flag stolen vehicles and wanted persons. The motion was made by Councilmember Hampton. Civil liberties advocates note LPR systems create databases of vehicle movement that raise questions about data retention policies and how long records are kept.' },
          { date:'Jan 13 2023', text:'Formally appointed as Chief of Police by Mayor Jenkins.', url:'https://www.georgetownky.gov/m/NewsFlash', summary:'Darin Allgood was formally appointed Georgetown\'s Chief of Police on January 13, 2023 at a special City Council session by Mayor Burney Jenkins — one of the Mayor\'s first major personnel decisions. Allgood had been serving with GPD since 2012, rising through the ranks from patrol officer to detective, sergeant, lieutenant, captain, and assistant chief before his appointment as chief.' },
        ], stats:[{ val:'2012', lbl:'Joined GPD' },{ val:'2023', lbl:'Became Chief' },{ val:'FBI #284', lbl:'Academy Class' }]
      },
      { name:'Josh Nash', ini:'JN', av:'av-b', title:'Asst. Chief of Police', tags:['t-police'],
        ph:'502-863-7826', f:'verified',
        notes:'Promoted Feb 14 2023. GPD since 2011. SRT Commander, Patrol Lt., Captain.',
        bio:'Josh Nash was promoted to Assistant Chief of Police on February 14, 2023 by Chief Allgood. He has served with Georgetown Police since 2011 and is a Defensive Tactics Instructor, former SRT member, and Honor Guard member. He holds an associate degree in criminal justice from BCTC and is an FBI National Academy Class 286 graduate.',
        positionSummary:'Assistant Chief of Police serves as second-in-command, supporting the Chief in daily operations, commanding assigned divisions, and acting as Chief in the Chief\'s absence.',
        socials:[], events:[
          { date:'Feb 14 2023', text:'Promoted to Assistant Chief by Chief Allgood.', url:'https://www.georgetownky.gov/m/NewsFlash', summary:'Josh Nash was promoted to Assistant Chief of Police on February 14, 2023 — just one month after Darin Allgood was appointed Chief. Nash had served with Georgetown Police since 2011, progressing from Patrol Officer through Sergeant, SRT Commander, Patrol Lieutenant, and Captain. He is a Defensive Tactics Instructor, former SRT and Honor Guard member, and a graduate of the FBI National Academy Class 286.' },
        ], stats:[{ val:'2011', lbl:'Joined GPD' },{ val:'2023', lbl:'Became Asst. Chief' },{ val:'FBI #286', lbl:'Academy Class' }]
      },
      { name:'Criminal Investigations', ini:'CI', av:'av-b', title:'CID Division', tags:['t-police'], ph:'502-863-7826', f:'verified', notes:'Felony and complex criminal investigations.', bio:'The Criminal Investigations Division handles felony and complex criminal cases.', positionSummary:'CID handles felony investigations, major crimes, and complex cases requiring dedicated detective work.', socials:[], events:[], stats:[] },
      { name:'Patrol Division', ini:'PD', av:'av-b', title:'Patrol', tags:['t-police'], ph:'502-863-7826', f:'updated', notes:'Front-line patrol. Hiring 2 additional officers (Oct 2025).', bio:'Georgetown Police Patrol Division provides front-line law enforcement services.', positionSummary:'Front-line patrol, traffic enforcement, community policing, and first response.', socials:[], events:[{ date:'Oct 2025', text:'Approved to hire 2 additional patrol officers.', url:'https://www.georgetownky.gov/AgendaCenter/ViewFile/Agenda/_10012025-263', summary:'The October 1, 2025 City Council meeting included authorization for Georgetown Police to hire two additional patrol officers. This expansion comes alongside the JAG-funded Community Recovery officers and reflects growth in Georgetown\'s population and the city\'s commitment to maintaining adequate police coverage. The positions were part of a broader effort to bring GPD staffing to levels recommended in the State of the City address.' }], stats:[] },
      { name:'Recovery Support Team', ini:'RS', av:'av-b', title:'Special Operations', tags:['t-police'], ph:'502-863-7826', f:'updated', notes:'JAG $147,588 approved Oct 1 2025. VAWA grant approved.', bio:'Community Recovery and Support team funded by JAG and VAWA grants.', positionSummary:'Provides community recovery and support services funded by federal JAG and VAWA grants.', socials:[], events:[{ date:'Oct 1 2025', text:'$147,588 JAG grant approved. VAWA grant also approved.', url:'https://www.georgetownky.gov/AgendaCenter/ViewFile/Agenda/_10012025-263', summary:'Two federal grants funding the Recovery Support Team were approved at the October 1 meeting: the $147,588 Justice Assistance Grant for Community Recovery and Support officers, and a Violence Against Women Act grant to support victim services. Together these grants fund personnel who work alongside traditional patrol officers, connecting people in crisis with services rather than simply making arrests.' }], stats:[] },
      { name:'Traffic Division', ini:'TD', av:'av-b', title:'Traffic', tags:['t-police'], ph:'502-863-7826', f:'updated', notes:'LPR & Intersection Camera MO approved Oct 1 2025.', bio:'Georgetown Police Traffic Division handles traffic enforcement and safety programs.', positionSummary:'Traffic enforcement, speed monitoring, crash investigation, and LPR operations.', socials:[], events:[{ date:'Oct 1 2025', text:'LPR and Intersection Camera Municipal Order approved by City Council.', url:'https://www.georgetownky.gov/AgendaCenter/ViewFile/Agenda/_10012025-263', summary:'The Traffic Division\'s License Plate Reader and intersection camera program received Council authorization at the October 1 meeting. This gives the Traffic Division new tools for identifying stolen vehicles, tracking wanted persons, and building evidentiary records for traffic investigations. The LPR system logs all plates that pass each camera point, raising questions for Georgetown residents about data retention periods and access policies.' }], stats:[] },
    ]},

  { id:'fire', name:'Georgetown Fire Department', phone:'502-863-7833', icon:'🚒', icoc:'di-r', group:'fire',
    desc:'Four stations + Training Center. Hiring Firefighter/EMTs.',
    members:[
      { name:'Seth Johnson', ini:'SJ', av:'av-r', title:'Fire Chief', tags:['t-fire'], ph:'502-863-7833', f:'verified',
        notes:'Confirmed Fire Chief Dec 2025. Smoke detector giveaway programs.',
        bio:'Seth Johnson serves as Georgetown\'s Fire Chief, confirmed in that role as of December 2025. He presented plans for community smoke detector giveaway events at the December 8 City Council meeting.',
        positionSummary:'Fire Chief commands all four stations and the Training Center. Responsible for fire suppression, EMS response, fire prevention education, personnel management, and equipment procurement.',
        socials:[], events:[{ date:'Dec 8 2025', text:'Presented smoke detector giveaway events for Georgetown residents to City Council.', url:'https://www.georgetownky.gov/AgendaCenter', summary:'At the December 8 City Council meeting, Fire Chief Johnson presented details of planned community smoke detector giveaway events. GFD regularly conducts these programs as part of fire prevention outreach — providing free smoke detectors to residents who need them and educating the public on proper installation and battery maintenance. These events are part of the department\'s broader community fire safety mission.' }], stats:[{ val:'4', lbl:'Stations' },{ val:'Dec 2025', lbl:'Confirmed Chief' }]
      },
      { name:'Station 1 — HQ', ini:'S1', av:'av-r', title:'101 Jacobs Drive', tags:['t-fire'], ph:'502-863-7831', f:'verified', notes:'Main station.', bio:'Georgetown Fire Station 1 — main headquarters.', positionSummary:'Primary fire and EMS station.', socials:[], events:[], stats:[] },
      { name:'Station 2', ini:'S2', av:'av-r', title:'Station 2', tags:['t-fire'], ph:'502-863-7832', f:'verified', notes:'Secondary coverage.', bio:'Georgetown Fire Station 2, secondary coverage area.', positionSummary:'Secondary fire and EMS coverage.', socials:[], events:[], stats:[] },
      { name:'Station 3', ini:'S3', av:'av-r', title:'Station 3', tags:['t-fire'], ph:'502-863-7833', f:'verified', notes:'Third coverage zone.', bio:'Georgetown Fire Station 3, third-zone coverage.', positionSummary:'Third-zone fire and EMS coverage.', socials:[], events:[], stats:[] },
    ]},

  { id:'public-works', name:'Public Works', phone:'502-863-9855', icon:'🚧', icoc:'di-p', group:'pw',
    desc:'Infrastructure, roads, resurfacing, utility coordination. 235 W Yusen Drive.',
    members:[{ name:'Public Works Director', ini:'PW', av:'av-p', title:'Director of Public Works', tags:['t-pw'], ph:'502-863-9855', f:'verified', notes:'Columbia Gas franchise 2025, road resurfacing, capital infrastructure.', bio:'Georgetown\'s Public Works Director oversees infrastructure, road resurfacing, utility coordination, and capital projects.', positionSummary:'Manages all city public works including road maintenance, infrastructure, and utility coordination.', socials:[], events:[{ date:'Sep 2025', text:'Columbia Gas Franchise Ordinance — coordinated utility franchise renewal.', url:'https://www.georgetownky.gov/AgendaCenter', summary:'The September 2025 Columbia Gas Franchise Ordinance — sponsored by Councilmember Lusby Mitchell — renewed and updated Columbia Gas of Kentucky\'s franchise agreement to operate natural gas distribution infrastructure within Georgetown. Public Works coordinates the practical aspects of the franchise: managing right-of-way access, overseeing excavation permits, and ensuring gas infrastructure work meets city standards. The franchise fee paid by Columbia Gas provides revenue to the city.' }], stats:[] }]},

  { id:'city-engineer', name:'City Engineer', phone:'502-570-8272', icon:'🔧', icoc:'di-p', group:'pw',
    desc:'CIP, infrastructure permitting, traffic engineering.',
    members:[{ name:'City Engineer', ini:'CE', av:'av-p', title:'City Engineer', tags:['t-pw'], ph:'502-570-8272', f:'verified', notes:'Lexington Way/Old Oxford Road, Lanes Run Business Park Ph 3, City Hall renovation.', bio:'Georgetown\'s City Engineer manages the Capital Improvement Program and provides engineering oversight.', positionSummary:'Manages CIP, reviews infrastructure plans, oversees traffic studies and engineering permitting.', socials:[], events:[], stats:[] }]},

  { id:'hr', name:'Human Resources', phone:'502-863-9800 ext.6', icon:'👥', icoc:'di-x', group:'admin',
    desc:'Hiring, compensation (Ordinance 2024-16), employee relations.',
    members:[{ name:'HR Director', ini:'HR', av:'av-t', title:'HR Director', tags:['t-admin'], ph:'502-863-9800 ext.6', f:'updated', notes:'Compensation Study → Ordinance 2024-16. Multiple positions recruiting.', bio:'Georgetown\'s Human Resources Director oversees city hiring, compensation, and employee relations for all 245 full-time employees.', positionSummary:'Manages city-wide recruitment, compensation, classification, employee benefits, and compliance for ~245 FT employees.', socials:[], events:[{ date:'Jun 2024', text:'Ordinance 2024-16 adopted following Management Advisory Group Compensation Study.', url:'https://www.georgetownky.gov/DocumentCenter/View/2748', summary:'Ordinance 2024-16 amended Georgetown\'s Personnel and Pay Classification Plan based on a comprehensive compensation study by Management Advisory Group Inc. The study benchmarked Georgetown\'s pay against peer cities and found adjustments were needed to remain competitive in hiring and retaining qualified staff across all departments. The ordinance was first publicly read on June 10, 2024, then formally adopted at a subsequent meeting.' }], stats:[{ val:'245', lbl:'FT Employees' }] }]},

  { id:'it', name:'Information Technology', phone:'502-863-9800', icon:'💻', icoc:'di-x', group:'admin',
    desc:'Network, CAD cloud migration, cybersecurity.',
    members:[{ name:'IT Department', ini:'IT', av:'av-b', title:'IT', tags:['t-admin'], ph:'502-863-9800', f:'updated', notes:'CAD cloud migration for City Hall, GPD, Dispatch. CAD Administrator hired.', bio:'IT department manages city network infrastructure, cybersecurity, and the CAD cloud migration.', positionSummary:'Manages all city technology infrastructure, cybersecurity, CAD systems, and technology procurement.', socials:[], events:[{ date:'Sep 8 2025', text:'CAD Administrator position added to Personnel Ordinance.', url:'https://www.georgetownky.gov/AgendaCenter', summary:'The September 8, 2025 Council vote to add a CAD Administrator to the city\'s Personnel Ordinance formally created and funded this new position, which will manage Georgetown\'s Computer-Aided Dispatch system — currently being migrated to a cloud platform serving police, fire, and 911 dispatch. Creating the position in the ordinance is required before the city can hire for it and establishes the compensation range.' }], stats:[] }]},

  { id:'dispatch', name:'911 Dispatch', phone:'502-863-7820', icon:'📡', icoc:'di-b', group:'police',
    desc:'Georgetown-Scott County Emergency Communications. CAD migration underway.',
    members:[{ name:'911 Coordinator', ini:'9C', av:'av-b', title:'Dispatch Supervisor', tags:['t-police'], ph:'502-863-7820', f:'updated', notes:'Facility assessment underway. Hiring Civilian 911 Coordinator.', bio:'Georgetown-Scott County 911 Dispatch provides emergency communications for police, fire, and EMS.', positionSummary:'Manages emergency communications 24/7 for Georgetown Police, Fire, and EMS.', socials:[], events:[{ date:'Oct 2025', text:'Hiring Civilian 911 Coordinator. CAD cloud migration in progress.', url:'https://www.georgetownky.gov/AgendaCenter', summary:'As of October 2025, Georgetown-Scott County 911 Dispatch was actively hiring a Civilian 911 Coordinator and managing the CAD cloud migration simultaneously. The CAD upgrade will replace aging dispatch technology with a cloud-based platform shared by police, fire, and 911 operations. A facility assessment for potential dispatch center expansion was also underway, reflecting the growing population\'s demands on emergency services.' }], stats:[] }]},

  { id:'grant', name:'Grant Administration', phone:'502-863-9800', icon:'📊', icoc:'di-gd', group:'admin',
    desc:'Federal and state grant management: ARPA, JAG, BVP, AIG, VAWA.',
    members:[{ name:'Grant Administration', ini:'GA', av:'av-gd', title:'Grant Administrator', tags:['t-finance'], ph:'502-863-9800', f:'updated', notes:'Active: JAG $147,588, AIG, BVP, VAWA. ARPA nearly exhausted.', bio:'Georgetown\'s grant administration manages multiple federal and state grant programs.', positionSummary:'Manages application, compliance, and reporting for all city grant funding.', socials:[], events:[{ date:'Nov 24 2025', text:'BVP Grant approved.', url:'https://www.georgetownky.gov/AgendaCenter/ViewFile/Minutes/_11242025-293', summary:'The Bulletproof Vest Partnership grant was approved unanimously at the November 24, 2025 Council meeting (moved by Lusby Mitchell, seconded by Stone). The federal BVP program reimburses law enforcement agencies up to 50% of the cost of body armor for sworn officers. Departments apply annually; this approval authorized Georgetown Police to submit the application for the current cycle.' },{ date:'Oct 1 2025', text:'JAG $147,588 and VAWA grant approved.', url:'https://www.georgetownky.gov/AgendaCenter/ViewFile/Agenda/_10012025-263', summary:'Two federal public safety grants were approved at the October 1 meeting: the Justice Assistance Grant ($147,588 for Community Recovery officers) and a Violence Against Women Act grant for victim services. Both were part of a package of police-related items including the LPR camera Municipal Order and surplus disposal. Total public safety-related spending authorized at this single meeting exceeded $150,000.' },{ date:'Sep 22 2025', text:'Airport Infrastructure Grant ratified.', url:'https://www.georgetownky.gov/AgendaCenter/ViewFile/Minutes/_09222025-235', summary:'The Airport Infrastructure Grant ratification was the sole item on the September 22, 2025 special meeting agenda. The Council voted to accept the AIG and authorize Mayor Jenkins to sign all associated documents. A separate special meeting rather than waiting for the next regular Council meeting indicates the grant acceptance had a deadline requiring immediate action. The AIG funds capital improvements at the Georgetown-Scott County Regional Airport.' }], stats:[{ val:'$147,588', lbl:'JAG Grant' }] }]},

  { id:'building', name:'Building Inspection', phone:'502-863-9802', icon:'🏗️', icoc:'di-x', group:'admin',
    desc:'Enforces Kentucky Building Code. Hiring Permit Technician.',
    members:[{ name:'Chief Building Official', ini:'CB', av:'av-t', title:'Chief Building Official', tags:['t-admin'], ph:'502-863-9802', f:'verified', notes:'Hiring Permit Technician Oct 2025.', bio:'Georgetown\'s Chief Building Official enforces Kentucky Building Code and Residential Code.', positionSummary:'Enforces KBC and KRC. Reviews plans, issues permits, conducts inspections.', socials:[], events:[{ date:'Oct 2025', text:'Hiring Permit Technician.', url:'https://www.georgetownky.gov/AgendaCenter', summary:'Georgetown\'s Building Inspection department was actively recruiting a Permit Technician as of October 2025, reflecting the increased workload created by Georgetown\'s rapid residential and commercial development. Permit Technicians process building permit applications, collect fees, and handle the administrative functions that enable the Chief Building Official to focus on inspections and code compliance.' }], stats:[] }]},

  { id:'code', name:'Code Enforcement', phone:'502-603-5844', icon:'📋', icoc:'di-x', group:'admin',
    desc:'Joint board: Georgetown, Sadieville, Stamping Ground, Scott County (2016 Interlocal).',
    members:[{ name:'Code Enforcement Officer', ini:'CE', av:'av-t', title:'Code Enforcement', tags:['t-admin'], ph:'502-603-5844', f:'updated', notes:'Hiring additional officer Oct 2025.', bio:'Georgetown Code Enforcement operates via 2016 Interlocal Agreement covering four jurisdictions.', positionSummary:'Enforces city codes for property maintenance, zoning compliance, and nuisance abatement.', socials:[], events:[{ date:'Oct 2025', text:'Hiring additional code enforcement officer.', url:'https://www.georgetownky.gov/AgendaCenter', summary:'Georgetown Code Enforcement was hiring an additional officer as of October 2025 to serve the joint enforcement area covering Georgetown, Sadieville, Stamping Ground, and unincorporated Scott County under the 2016 Interlocal Agreement. Increased development activity has put greater demands on code enforcement staff to ensure new and existing properties comply with city codes for maintenance, zoning, and nuisance abatement.' }], stats:[] }]},

  { id:'housing-dept', name:'Affordable Housing', phone:'502-863-9800', icon:'🏠', icoc:'di-t', group:'admin',
    desc:'Housing affordability and homelessness prevention.',
    members:[{ name:'Housing Director', ini:'HD', av:'av-t', title:'Director', tags:['t-admin'], ph:'502-863-9800', f:'verified', notes:'Coordinates with Georgetown Housing Authority.', bio:'Director of Affordable Housing and Homelessness Prevention coordinates city housing access programs.', positionSummary:'Manages city affordable housing initiatives and homelessness prevention programs.', socials:[], events:[], stats:[] }]},

  { id:'cemetery', name:'Cemetery', phone:'502-863-1173', icon:'🌿', icoc:'di-x', group:'admin',
    desc:'City cemetery operations.',
    members:[{ name:'Cemetery Department', ini:'CM', av:'av-t', title:'City Cemetery', tags:['t-admin'], ph:'502-863-1173', f:'verified', notes:'Burial arrangements, lot inquiries, maintenance.', bio:'Georgetown City Cemetery manages burial arrangements, lot sales, and cemetery maintenance.', positionSummary:'Manages city cemetery operations.', socials:[], events:[], stats:[] }]},
// ─── NEW GROUPS FOR DEPTS ─────────────────────────────────────────────────────
// Appended to DEPTS array: stormwater, EMS, council committees

  { id:'stormwater', name:'Stormwater Division', phone:'502-863-9855', icon:'🌧️', icoc:'di-b', group:'pw',
    desc:'KPDES Phase II MS4 co-permittee with Scott County and Georgetown College. $1.2M+ FY25 budget. Studying utility fee.',
    members:[{
      name:'Stormwater Division', ini:'SW', av:'av-p', title:'Public Works — Stormwater', tags:['t-pw','t-env'],
      ph:'502-863-9855', f:'updated',
      notes:'Co-permittee on KPDES Phase II MS4 permit with Scott County Fiscal Court and Georgetown College. $1.2M+ budgeted FY25. Stormwater utility fee study underway (12–18 months). FEMA FIRM maps effective Dec 21 2017.',
      bio:'Georgetown\'s Stormwater Division operates under Public Works and manages the city\'s stormwater infrastructure, regulatory compliance, and capital program. The city is a co-permittee under a Kentucky Pollutant Discharge Elimination System (KPDES) Phase II MS4 permit authorized by the U.S. EPA and administered by the Kentucky Division of Water. Georgetown partners with Scott County Fiscal Court and Georgetown College on this permit. The FY25 adopted budget included over $1.2 million for stormwater expenses, and the city is funding a professional services study to develop a dedicated stormwater utility fee — a process expected to take 12–18 months. FEMA Flood Insurance Rate Maps for Scott County became effective December 21, 2017.',
      positionSummary:'Manages stormwater infrastructure maintenance and capital projects, ensures KPDES MS4 permit compliance, enforces Stormwater Ordinance 15-001 (effective April 2015), coordinates FEMA FIRM map updates, and administers post-construction BMP maintenance requirements.',
      socials:[{ platform:'Stormwater Info', url:'https://www.georgetownky.gov/2233/Stormwater', label:'City Stormwater Page', icon:'🔗' }],
      events:[
        { date:'FY2025', text:'$1.2M+ budgeted for stormwater expenses — one of the largest single line items in the Public Works capital program.', url:'https://www.georgetownky.gov/DocumentCenter/View/2755/City-of-Georgetown-Adopted-Budget-2024-2025', summary:'The FY2025 adopted budget directed over $1.2 million to stormwater maintenance and capital repairs, reflecting the city\'s significant investment in drainage infrastructure as Georgetown grows rapidly. The budget also funded professional services to study the creation of a dedicated stormwater utility fee, which would create a sustainable long-term funding mechanism independent of the general fund.' },
        { date:'Apr 2015', text:'Stormwater Ordinance 15-001 enacted — governs post-construction maintenance of stormwater features within Georgetown city limits.', url:'https://www.gscplanning.com/engineering', summary:'Georgetown\'s Stormwater Ordinance 15-001 establishes requirements for the post-construction maintenance of stormwater management features within city limits. It differs from the Scott County ordinance and applies to both new development and existing properties. The ordinance works in conjunction with the GSCPC Stormwater Manual Best Management Practices document.' },
        { date:'Dec 21 2017', text:'FEMA Flood Insurance Rate Maps became effective for Scott County, Georgetown, Stamping Ground, and Sadieville — some properties may have changed flood zone status.', url:'https://www.gscplanning.com/engineering', summary:'FEMA\'s updated Flood Insurance Rate Maps took effect for Scott County on December 21, 2017, potentially changing flood zone designations for properties across Georgetown. Property owners should verify their current flood zone status as it affects flood insurance requirements and eligibility for federal disaster assistance.' },
      ],
      stats:[{ val:'$1.2M+', lbl:'FY25 Budget' },{ val:'MS4', lbl:'KPDES Permit' },{ val:'2015', lbl:'Ordinance Year' }]
    }]},

  { id:'ems', name:'Georgetown/Scott County EMS', phone:'502-863-7833', icon:'🚑', icoc:'di-r', group:'fire',
    desc:'Advanced Life Support EMS. New jointly-funded EMS station in FY25 CIP. Staffed 24/7.',
    members:[{
      name:'EMS Division', ini:'EM', av:'av-r', title:'Emergency Medical Services', tags:['t-fire','t-ems'],
      ph:'502-863-7833', f:'updated',
      notes:'ALS-level service. New EMS station construction in FY25 CIP (joint funding with Scott County). Co-located with fire stations.',
      bio:'Georgetown/Scott County EMS provides Advanced Life Support emergency medical services as part of Georgetown Fire & Rescue. The FY2025 adopted budget includes capital funding for construction of a new jointly-funded EMS station, a significant infrastructure investment shared between the city and Scott County. EMS personnel are cross-trained with fire operations and operate 24 hours a day from all four Georgetown fire stations.',
      positionSummary:'Provides ALS emergency medical response, coordinates with Scott County EMS for mutual aid coverage, manages medical equipment and supply inventory, maintains certification compliance for all EMT and paramedic staff, and oversees the jointly-funded EMS station capital project.',
      socials:[{ platform:'GFD Website', url:'https://www.georgetownky.gov/2155/Fire', label:'Georgetown Fire & Rescue', icon:'🔗' }],
      events:[
        { date:'FY2025', text:'New jointly-funded EMS station included in CIP capital budget — shared cost with Scott County Fiscal Court.', url:'https://www.georgetownky.gov/DocumentCenter/View/2755/City-of-Georgetown-Adopted-Budget-2024-2025', summary:'The FY2025 Capital Improvement Program includes construction of a new EMS station with joint funding between Georgetown and Scott County. This station will improve response times in underserved coverage areas as Georgetown\'s population has grown to over 37,000 residents. The joint funding arrangement demonstrates the ongoing intergovernmental partnership between the city and county for emergency services.' },
      ],
      stats:[{ val:'ALS', lbl:'Service Level' },{ val:'24/7', lbl:'Coverage' }]
    }]},

  { id:'committee-finance', name:'Council Finance Committee', phone:'502-863-9800', icon:'💼', icoc:'di-gd', group:'committees',
    desc:'Standing sub-committee of City Council. Reviews budget, expenditures, and financial policy. Meets separately from full Council.',
    members:[{
      name:'Finance Committee', ini:'FC', av:'av-gd', title:'City Council Standing Committee', tags:['t-council','t-finance','t-committee'],
      ph:'502-863-9800', f:'updated',
      notes:'Standing committee of City Council. Meets to review financial matters before full Council vote. Agendas posted on georgetownky.gov.',
      bio:'The Finance Committee is a standing sub-committee of the Georgetown City Council that reviews budgetary matters, expenditure approvals, financial policy, and related items prior to full Council consideration. Committee members are Council-appointed and meetings are open to the public with agendas posted on the city website. The Finance Committee plays a key role in fiscal oversight between full Council meetings.',
      positionSummary:'Reviews budget amendments, capital expenditure requests, grant applications, investment policy, fee schedules, and financial reporting before items advance to the full City Council for a vote.',
      socials:[{ platform:'Agenda Center', url:'https://www.georgetownky.gov/AgendaCenter', label:'Finance Committee Agendas', icon:'📋' }],
      events:[
        { date:'Active 2025–2026', text:'Finance Committee meetings active and listed on city event calendar alongside full Council meetings.', url:'https://www.georgetownky.gov/AgendaCenter', summary:'The Finance Committee meets regularly as a standing sub-committee of Georgetown City Council, with its own agendas posted on the city\'s Agenda Center. Its meetings are separate from — and typically precede — related items on the full Council agenda, providing an additional layer of fiscal review.' },
      ],
      stats:[]
    }]},

  { id:'committee-traffic', name:'Council Traffic Committee', phone:'502-863-9800', icon:'🚦', icoc:'di-a', group:'committees',
    desc:'Standing sub-committee reviewing traffic studies, LPR deployment, infrastructure priorities, and road safety.',
    members:[{
      name:'Traffic Committee', ini:'TC', av:'av-a', title:'City Council Standing Committee', tags:['t-council','t-pw','t-committee'],
      ph:'502-863-9800', f:'updated',
      notes:'Reviewed 2025 Traffic Study results before full Council vote Sep 8. Reviews LPR deployment, signal timing, road safety.',
      bio:'The Traffic Committee is a standing sub-committee of Georgetown City Council responsible for reviewing traffic-related matters including road safety studies, signal timing, LPR camera deployments, and infrastructure priorities before items advance to the full Council. The committee reviewed results of Georgetown\'s 2025 Traffic Study — which the full Council then accepted via Municipal Order on September 8, 2025.',
      positionSummary:'Reviews traffic studies, road safety improvements, signal optimization, LPR/camera programs, pedestrian infrastructure, and coordinates with the City Engineer on transportation-related CIP projects before full Council action.',
      socials:[{ platform:'Agenda Center', url:'https://www.georgetownky.gov/AgendaCenter', label:'Traffic Committee Agendas', icon:'📋' }],
      events:[
        { date:'Sep 2025', text:'Reviewed 2025 Traffic Study before full Council accepted results via Municipal Order on Sep 8, 2025.', url:'https://www.georgetownky.gov/AgendaCenter', summary:'The Traffic Committee reviewed the findings of Georgetown\'s 2025 Traffic Study before the full City Council accepted the study via Municipal Order at the September 8, 2025 regular meeting. The study\'s recommendations will inform future signal timing changes, road improvements, and infrastructure priorities — including implementation of LPR cameras approved at the October 1 meeting.' },
      ],
      stats:[]
    }]},

  { id:'committee-pw', name:'Council Public Works Committee', phone:'502-863-9800', icon:'🔩', icoc:'di-p', group:'committees',
    desc:'Standing sub-committee overseeing road program, infrastructure projects, utility coordination, and CIP capital work.',
    members:[{
      name:'Public Works Committee', ini:'PW', av:'av-p', title:'City Council Standing Committee', tags:['t-council','t-pw','t-committee'],
      ph:'502-863-9800', f:'updated',
      notes:'Meets to review CIP, road resurfacing, utility franchise matters, and infrastructure projects before full Council.',
      bio:'The Public Works Committee is a standing sub-committee of Georgetown City Council that reviews capital infrastructure projects, road resurfacing programs, utility coordination (including franchise agreements like the Columbia Gas Ordinance), and Public Works Department priorities before items advance to the full Council for a vote.',
      positionSummary:'Reviews CIP project proposals, road resurfacing program prioritization, utility franchise matters, stormwater infrastructure, sidewalk programs, and Public Works operating needs before full Council consideration.',
      socials:[{ platform:'Agenda Center', url:'https://www.georgetownky.gov/AgendaCenter', label:'Public Works Committee Agendas', icon:'📋' }],
      events:[
        { date:'Active 2025–2026', text:'Public Works Committee meetings active with separate agendas on city event calendar.', url:'https://www.georgetownky.gov/AgendaCenter', summary:'The Public Works Committee meets as a standing sub-committee of Georgetown City Council, reviewing infrastructure matters including road projects, utility coordination, stormwater capital work, and CIP priorities before items reach the full Council agenda.' },
      ],
      stats:[]
    }]},
];

export const PLANNING = [
  { id:'gscpc', name:'Georgetown-Scott County Planning Commission', phone:'502-867-3701', icon:'📐', icoc:'di-a', group:'planning',
    desc:'Joint planning under KRS 100. Comprehensive Plan, zoning, subdivisions. 230 E Main St.',
    members:[
      { name:'Joe Kane', ini:'JK', av:'av-a', title:'Director / Senior Planner', tags:['t-plan'], ph:'502-867-3701', f:'verified', notes:'Director of GSCPC. Long-range planning and development review.', bio:'Joe Kane serves as Director of the Georgetown-Scott County Planning Commission, managing long-range planning initiatives including the 2024 Comprehensive Plan update.', positionSummary:'Manages GSCPC operations: Comprehensive Plan updates, zoning administration, subdivision review, and staff coordination.', socials:[], events:[{ date:'2024', text:'Led completion of the GSCPC 2024 Comprehensive Plan update.', url:'https://www.gscplanning.com/comprehensive-plan', summary:'Under Director Joe Kane\'s leadership, the Georgetown-Scott County Planning Commission completed the 2024 Comprehensive Plan update — a long-range policy document guiding land use, zoning, transportation, and development through 2040. The update was particularly significant given Georgetown\'s rapid growth; it includes a \'Western Expansion Area\' analysis and a Community Forum element gathering public input. The plan forms the legal basis for all major zoning decisions.' }], stats:[] },
      { name:'Planning Commissioners (9)', ini:'PC', av:'av-a', title:'Appointed Board', tags:['t-plan','t-board'], ph:'502-867-3701', f:'updated', notes:'City and County members on staggered 4-year terms. KRS 100 authority.', bio:'The Planning Commission has 9 members appointed by city and county governments on staggered 4-year terms.', positionSummary:'Adopts and amends the Comprehensive Plan, administers zoning, reviews subdivision plats and development plans.', socials:[], events:[], stats:[] },
      { name:'Development Review Engineer', ini:'DR', av:'av-a', title:'Open Position — Mar 2026', tags:['t-plan'], ph:'502-867-3701', f:'new', notes:'Actively recruiting as of Mar 2026.', bio:'GSCPC is actively hiring a Development Review Engineer to review subdivision plats and development plans.', positionSummary:'Engineering review of subdivision plats and development plans.', socials:[], events:[{ date:'Mar 2026', text:'Position actively being recruited.', url:'https://www.gscplanning.com/employment', summary:'As of March 2026, the Georgetown-Scott County Planning Commission was actively recruiting a Development Review Engineer to handle engineering review of subdivision plats and development plans. Given Georgetown\'s rapid growth, this position is essential to maintaining timely review of the development projects coming before the Commission. Interested candidates can apply through the GSCPC employment page.' }], stats:[] },
    ]},
  { id:'gboa-city', name:'Georgetown Board of Adjustment (City)', phone:'502-863-9800', icon:'🏘️', icoc:'di-p', group:'planning',
    desc:'Zoning variances within City limits. 7 members.',
    members:[
      { name:'Frank Allen', ini:'FA', av:'av-p', title:'Board Member', tags:['t-board','t-plan'], ph:'502-863-9800', f:'new', notes:'Reappointed unanimously Nov 24 2025 (motion Stone).', bio:'Frank Allen serves on the Georgetown Board of Adjustment, reappointed unanimously November 2025.', positionSummary:'Hears zoning variance applications, conditional use permits, and administrative zoning appeals.', socials:[], events:[{ date:'Nov 24 2025', text:'Reappointed unanimously — motion by Councilmember Stone.', url:'https://www.georgetownky.gov/AgendaCenter/ViewFile/Minutes/_11242025-293', summary:'Frank Allen\'s reappointment to the Georgetown Board of Adjustment was moved by Councilmember Stone and seconded by Councilmember Lusby Mitchell at the November 24 meeting, passing unanimously. The Board of Adjustment hears applications for zoning variances, conditional use permits, and appeals of administrative zoning decisions within Georgetown city limits. Allen\'s continued service maintains experienced membership on this quasi-judicial body.' }], stats:[] },
      { name:'Virginia Teague', ini:'VT', av:'av-p', title:'Board Member', tags:['t-board','t-plan'], ph:'502-863-9800', f:'new', notes:'Reappointed unanimously Nov 24 2025 (motion Hambrick).', bio:'Virginia Teague serves on the Georgetown Board of Adjustment, reappointed unanimously November 2025.', positionSummary:'Hears zoning variance applications, conditional use permits, and administrative zoning appeals.', socials:[], events:[{ date:'Nov 24 2025', text:'Reappointed unanimously — motion by Councilmember Hambrick.', url:'https://www.georgetownky.gov/AgendaCenter/ViewFile/Minutes/_11242025-293', summary:'Frank Allen\'s reappointment to the Georgetown Board of Adjustment was moved by Councilmember Stone and seconded by Councilmember Lusby Mitchell at the November 24 meeting, passing unanimously. The Board of Adjustment hears applications for zoning variances, conditional use permits, and appeals of administrative zoning decisions within Georgetown city limits. Allen\'s continued service maintains experienced membership on this quasi-judicial body.' }], stats:[] },
    ]},
  { id:'gmwss', name:'GMWSS Board of Commissioners', phone:'502-863-9800', icon:'💧', icoc:'di-t', group:'regional',
    desc:'Georgetown Municipal Water & Sewer. KRS 96.320. Sets rates, approves capital.',
    members:[
      { name:'Jason Baird', ini:'JB', av:'av-t', title:'Commissioner', tags:['t-board','t-regional'], ph:'502-863-9800', f:'new', notes:'Reappointed unanimously Nov 24 2025.', bio:'Jason Baird is a GMWSS Board commissioner, reappointed November 2025.', positionSummary:'GMWSS Board oversees Georgetown\'s municipal water and sewer system under KRS 96.320.', socials:[], events:[{ date:'Nov 24 2025', text:'Reappointed unanimously — motion by Hambrick.', url:'https://www.georgetownky.gov/AgendaCenter/ViewFile/Minutes/_11242025-293', summary:'Jason Baird\'s reappointment to the GMWSS Board of Commissioners was moved by Councilmember Hambrick and seconded by Councilmember Menke at the November 24 meeting, passing unanimously. The GMWSS Board oversees Georgetown\'s municipal water and sewer system under KRS 96.320 authority, setting rates, approving capital projects, and managing the utility\'s budget. The Board was managing over $296,000 in contractor payments at this same meeting.' }], stats:[] },
      { name:'Kent Chandler', ini:'KC', av:'av-t', title:'Commissioner', tags:['t-board','t-regional'], ph:'502-863-9800', f:'new', notes:'New appointment Nov 24 2025.', bio:'Kent Chandler was newly appointed to the GMWSS Board November 2025.', positionSummary:'GMWSS Board oversees Georgetown\'s water and sewer utility.', socials:[], events:[{ date:'Nov 24 2025', text:'Newly appointed — motion by Hambrick.', url:'https://www.georgetownky.gov/AgendaCenter/ViewFile/Minutes/_11242025-293', summary:'Kent Chandler was newly appointed — not reappointed — to the GMWSS Board at the November 24 meeting, filling a vacancy. His appointment was moved by Councilmember Hambrick and seconded by Councilmember Menke, passing unanimously. As a new member, Chandler brings fresh perspective to the Board overseeing Georgetown\'s water and sewer utility at a time of significant infrastructure investment driven by rapid development.' }], stats:[] },
      { name:'Jeff Klocke', ini:'JK', av:'av-t', title:'Commissioner (Pending)', tags:['t-board','t-regional'], ph:'502-863-9800', f:'updated', notes:'Reappointment tabled to Dec 8 2025 (motion Tingle Sames).', bio:'Jeff Klocke\'s GMWSS reappointment was tabled from Nov 24 to Dec 8 2025 via a subsidiary motion.', positionSummary:'GMWSS Board oversees Georgetown\'s water and sewer utility.', socials:[], events:[{ date:'Nov 24 2025', text:'Reappointment tabled to Dec 8 — motion by Tingle Sames.', url:'https://www.georgetownky.gov/AgendaCenter/ViewFile/Minutes/_11242025-293', summary:'Jeff Klocke\'s GMWSS reappointment was tabled from November 24 to December 8 via a subsidiary motion by Councilmember Tingle Sames (seconded by Wilkins Brent). This was one of the first applications of Hampton\'s newly passed transparency reform — requiring candidates to provide resumes and service history before a vote — effectively pausing the reappointment to allow time for that documentation to be gathered and reviewed.' }], stats:[] },
    ]},
  { id:'tourism', name:'Georgetown/Scott County Tourism Commission', phone:'502-863-2547', icon:'🎡', icoc:'di-a', group:'regional',
    desc:'KRS 91A.350. Convention and tourism promotion. Manages transient room fees.',
    members:[{ name:'Lori Cooper Saunders', ini:'LS', av:'av-a', title:'Executive Director', tags:['t-regional'], ph:'502-863-2547', f:'new', notes:'2025 KACVB President. 2025 David Lose Award. Multiple KTIA Traverse Awards.', bio:'Lori Cooper Saunders leads Georgetown/Scott County Tourism. In 2025 she was named KACVB President and received the Kentucky Recreation and Park Society\'s David Lose Award. The commission won multiple KTIA Traverse Awards for Excellence in Kentucky Tourism.', positionSummary:'Leads convention and tourist activity promotion, managing transient room tax revenues and marketing programs.', socials:[], events:[{ date:'2025', text:'Named 2025 KACVB President and received 2025 David Lose Award (KRPS).', url:'https://www.georgetownky.com/', summary:'In 2025, Georgetown-Scott County Tourism Executive Director Lori Cooper Saunders was named President of the Kentucky Association of Convention & Visitors Bureaus (KACVB), representing tourism professionals statewide. She also received the 2025 David Lose Award from the Kentucky Recreation and Park Society (KRPS), which recognizes outstanding contributions to parks, recreation, and tourism partnerships. Both honors reflect Georgetown/Scott County Tourism\'s rising national profile.' },{ date:'2025', text:'Georgetown/Scott County Tourism won multiple KTIA Traverse Awards.', url:'https://www.georgetownky.com/', summary:'Georgetown/Scott County Tourism received multiple Traverse Awards for Excellence in Kentucky Tourism from the Kentucky Travel Industry Association (KTIA). The Traverse Awards are the state\'s premier tourism marketing honors, recognizing outstanding campaigns, programs, and community engagement. The multiple awards reflect strong marketing performance by the Tourism Commission under Lori Saunders\' leadership.' }], stats:[{ val:'KACVB', lbl:'2025 President' }] }]},
  { id:'parks', name:'Georgetown/Scott County Parks Board', phone:'502-863-9800', icon:'🌳', icoc:'di-g', group:'regional',
    desc:'KRS 97.035. Parks, playgrounds, and recreation.',
    members:[{ name:'Parks Board', ini:'PB', av:'av-g', title:'Appointed Board', tags:['t-board','t-regional'], ph:'502-863-9800', f:'verified', notes:'Joint city-county board.', bio:'The Parks Board manages parks, playgrounds, and recreation centers jointly for City and County.', positionSummary:'Provides, conducts, and maintains parks, playgrounds, and recreation facilities.', socials:[], events:[], stats:[] }]},
  { id:'airport', name:'Georgetown/Scott County Regional Airport Board', phone:'502-863-9800', icon:'✈️', icoc:'di-b', group:'regional',
    desc:'KRS 183.133. Airport establishment and expansion. Accepting applications Feb 2026.',
    members:[{ name:'Airport Board', ini:'AB', av:'av-b', title:'Appointed Board', tags:['t-board','t-regional'], ph:'502-863-9800', f:'new', notes:'Accepting applications Feb 2026. AIG accepted Sep 2025.', bio:'The Airport Board oversees the regional airport. The Airport Infrastructure Grant was accepted September 22 2025.', positionSummary:'Establishes, maintains, and expands the regional airport. Sets facility rates and annual budget.', socials:[], events:[{ date:'Sep 22 2025', text:'Airport Infrastructure Grant ratified.', url:'https://www.georgetownky.gov/AgendaCenter/ViewFile/Minutes/_09222025-235', summary:'The Airport Infrastructure Grant ratification was the sole item on the September 22, 2025 special meeting agenda. The Council voted to accept the AIG and authorize Mayor Jenkins to sign all associated documents. A separate special meeting rather than waiting for the next regular Council meeting indicates the grant acceptance had a deadline requiring immediate action. The AIG funds capital improvements at the Georgetown-Scott County Regional Airport.' },{ date:'Feb 2026', text:'Accepting applications for board vacancies.', url:'https://www.georgetownky.gov/FormCenter/Encrypted-Forms-10/Application-for-Board-and-Commission-Mem-64', summary:'Georgetown is accepting applications for service on the Airport Board (and Housing Authority Board) as of February 2026. Board members are appointed by City Council and serve without compensation. Under the November 2025 Hampton reform, applicants must now submit a resume and disclose prior board service history. Apply through the city website\'s online application form.' }], stats:[] }]},
  { id:'housing-auth', name:'Georgetown Housing Authority', phone:'502-863-9800', icon:'🏠', icoc:'di-t', group:'regional',
    desc:'KRS 80.030. Low/moderate income housing.',
    members:[
      { name:'Patricia Harman', ini:'PH', av:'av-t', title:'Commissioner', tags:['t-board','t-regional'], ph:'502-863-9800', f:'new', notes:'Reappointed unanimously Nov 24 2025 (motion Menke).', bio:'Patricia Harman serves as a Georgetown Housing Authority commissioner, reappointed November 2025.', positionSummary:'Housing Authority provides adequate housing for low/moderate income residents.', socials:[], events:[{ date:'Nov 24 2025', text:'Reappointed unanimously — motion by Menke.', url:'https://www.georgetownky.gov/AgendaCenter/ViewFile/Minutes/_11242025-293', summary:'Patricia Harman\'s reappointment to the Georgetown Housing Authority Board was moved by Councilmember Menke and seconded by Councilmember Hambrick at the November 24 meeting, passing unanimously. The Housing Authority provides and manages affordable housing for low and moderate income Georgetown residents. With the city growing rapidly, the Authority\'s role in maintaining housing access for lower-income residents is increasingly critical.' }], stats:[] },
      { name:'Board Vacancies', ini:'HV', av:'av-t', title:'Open Positions', tags:['t-board'], ph:'502-863-9800', f:'new', notes:'Accepting applications Feb 2026.', bio:'Housing Authority has open board positions as of February 2026.', positionSummary:'Open board positions — apply via city website.', socials:[], events:[], stats:[] },
    ]},
  { id:'ethics', name:'Board of Ethics', phone:'502-863-9800', icon:'⚖️', icoc:'di-t', group:'regional',
    desc:'KRS 65.003. Ethics enforcement, investigations, advisory opinions.',
    members:[
      { name:'Renee Causey-Upton', ini:'RC', av:'av-t', title:'Board Member', tags:['t-board'], ph:'502-863-9800', f:'new', notes:'Reappointed unanimously Nov 24 2025 (motion Lusby Mitchell).', bio:'Renee Causey-Upton serves on Georgetown\'s Board of Ethics, reappointed November 2025.', positionSummary:'Enforces Georgetown Code of Ethics, conducts investigations, issues advisory opinions.', socials:[], events:[{ date:'Nov 24 2025', text:'Reappointed unanimously — motion by Lusby Mitchell.', url:'https://www.georgetownky.gov/AgendaCenter/ViewFile/Minutes/_11242025-293', summary:'Renee Causey-Upton\'s reappointment to Georgetown\'s Board of Ethics was moved by Councilmember Lusby Mitchell and seconded by Councilmember Hampton at the November 24 meeting, passing unanimously. The Board of Ethics enforces Georgetown\'s Code of Ethics, conducts investigations into alleged misconduct by city officials, issues advisory opinions, and reviews annual financial interest statements. Notably, two other Ethics Board reappointments were pulled from the same agenda by Mayor Jenkins before the meeting.' }], stats:[] },
      { name:'Gui Cozzi', ini:'GC', av:'av-t', title:'Board Member', tags:['t-board'], ph:'502-863-9800', f:'new', notes:'Reappointed unanimously Nov 24 2025 (motion Stone).', bio:'Gui Cozzi serves on Georgetown\'s Board of Ethics, reappointed November 2025.', positionSummary:'Enforces Georgetown Code of Ethics, conducts investigations, issues advisory opinions.', socials:[], events:[{ date:'Nov 24 2025', text:'Reappointed unanimously — motion by Stone.', url:'https://www.georgetownky.gov/AgendaCenter/ViewFile/Minutes/_11242025-293', summary:'Gui Cozzi\'s reappointment to Georgetown\'s Board of Ethics was moved by Councilmember Stone and seconded by Councilmember Wilkins Brent at the November 24 meeting, passing unanimously. Cozzi and Causey-Upton were the only two Ethics Board reappointments that proceeded — Mayor Jenkins pulled two other proposed Ethics appointments from the agenda before the meeting opened.' }], stats:[] },
    ]},
  { id:'human-rights', name:'Human Rights Commission', phone:'502-863-9800', icon:'🤝', icoc:'di-t', group:'regional',
    desc:'Discrimination complaint investigations and civil rights enforcement.',
    members:[{ name:'April Baker', ini:'AB', av:'av-t', title:'Member', tags:['t-board'], ph:'502-863-9800', f:'new', notes:'Reappointed Nov 24 2025 — 7-0, 1 recusal (Wilkins Brent).', bio:'April Baker serves on Georgetown\'s Human Rights Commission. Her reappointment passed 7-0 with Wilkins Brent recusing due to family member conflict.', positionSummary:'Receives and investigates discrimination complaints across protected categories.', socials:[], events:[{ date:'Nov 24 2025', text:'Reappointed 7-0 (Wilkins Brent recused). Motion by Stone.', url:'https://www.georgetownky.gov/AgendaCenter/ViewFile/Minutes/_11242025-293', summary:'April Baker\'s reappointment to Georgetown\'s Human Rights Commission was moved by Councilmember Stone and seconded by Councilmember Hampton at the November 24 meeting. Councilmember Wilkins Brent voluntarily recused herself because the appointee is a family member — a conflict she disclosed publicly. The vote passed 7-0 with 1 recusal. The Human Rights Commission receives and investigates discrimination complaints across multiple protected categories.' }], stats:[] }]},
  { id:'revenue', name:'Georgetown-Scott County Revenue Commission', phone:'502-603-5860', icon:'💰', icoc:'di-gd', group:'regional',
    desc:'Occupational tax administration for City, County, and School District.',
    members:[{ name:'Revenue Commission', ini:'RC', av:'av-gd', title:'Tax Administration', tags:['t-regional','t-finance'], ph:'502-603-5860', f:'verified', notes:'230 E Main St. Administers occupational tax.', bio:'The Georgetown-Scott County Revenue Commission administers occupational tax laws for three taxing entities.', positionSummary:'Administers occupational tax collection for City, County, and School District.', socials:[], events:[], stats:[] }]},
// ─── NEW PLANNING/REGIONAL ENTRIES ───────────────────────────────────────────

  { id:'gacc', name:'Georgetown Arts & Cultural Commission', phone:'502-863-9800', icon:'🎨', icoc:'di-a', group:'arts',
    desc:'Appointed advisory body. A-Tax/H-Tax funded. Promotes arts, culture, public art, and tourism. Website: gtownacc.com.',
    members:[{
      name:'GACC — Arts & Cultural Commission', ini:'AC', av:'av-a', title:'City Advisory Commission', tags:['t-board','t-arts','t-regional'],
      ph:'502-863-9800', f:'verified',
      notes:'Manages A-Tax (Accommodation Tax) and H-Tax (Hospitality Tax) allocations for arts programming. Website: gtownacc.com.',
      bio:'The Georgetown Arts & Cultural Commission (GACC) is an appointed advisory body of the City of Georgetown government, created to enrich and improve the quality of life of residents, attract visitors, promote visual, performing, culinary, and literary arts, foster the city\'s cultural heritage, and improve tourism and economic development by advising and assisting the city with public art placemaking and recommending artistic and cultural events, projects, and initiatives. The Commission manages allocations from A-Tax (Accommodation Tax) and H-Tax (Hospitality Tax) revenues — a funding stream that has appeared in City Council budget workshops.',
      positionSummary:'Advises City Council on arts and cultural programming, recommends A-Tax/H-Tax allocations, oversees public art installations, promotes performing and visual arts events, fosters Georgetown\'s cultural heritage, and coordinates with the Tourism Commission on arts-driven visitor attraction.',
      socials:[
        { platform:'GACC Website', url:'https://www.gtownacc.com/', label:'gtownacc.com', icon:'🔗' },
        { platform:'City Boards Page', url:'https://www.georgetownky.gov/2221/Boards-and-Commissions', label:'Official Board Info', icon:'📋' }
      ],
      events:[
        { date:'Apr 2023', text:'A-Tax/H-Tax allocation workshop held to review arts and tourism funding for FY2023–24.', url:'https://www.georgetownky.gov/AgendaCenter', summary:'The City Council held a budget workshop specifically on A-Tax (Accommodation Tax) and H-Tax (Hospitality Tax) allocations to the Arts & Cultural Commission and Tourism Commission. These dedicated tax streams fund arts programming and tourism marketing and are reviewed annually.' },
        { date:'Jul 2022', text:'A-Tax/H-Tax Committee Meeting — revenue allocation for tourism and arts programming reviewed.', url:'https://www.georgetownky.gov/AgendaCenter', summary:'A special A-Tax/H-Tax Committee meeting reviewed the allocation of accommodation and hospitality tax revenues between arts and tourism programs. These revenues — collected from Georgetown hotels and restaurants — are designated by state law for tourism and cultural promotion.' },
      ],
      stats:[{ val:'A-Tax', lbl:'Primary Funding' },{ val:'H-Tax', lbl:'Secondary Funding' }]
    }]},

  { id:'sister-city', name:'Georgetown Sister City Committee', phone:'502-863-9800', icon:'🌐', icoc:'di-t', group:'arts',
    desc:'Established 1986 under Mayor Prather when Toyota broke ground. International cultural exchange.',
    members:[{
      name:'Sister City Committee', ini:'SC', av:'av-t', title:'Advisory Committee', tags:['t-board','t-arts'],
      ph:'502-863-9800', f:'updated',
      notes:'Relationship established 1986. Special meeting held Jul 22 2025. Toyota connection integral to founding.',
      bio:'The Georgetown Sister City Committee manages Georgetown\'s international sister city relationship, established in 1986 under Mayor Tom Prather when Toyota Motor Manufacturing first broke ground in Georgetown — a corporate event that catalyzed the city\'s transformation into a manufacturing hub. The Committee fosters cultural exchange, goodwill, and economic ties between Georgetown and its international sister city. A special committee meeting was held July 22, 2025.',
      positionSummary:'Coordinates cultural exchange programs, manages sister city relationship activities, facilitates international delegations, and promotes awareness of Georgetown\'s global connections rooted in the Toyota manufacturing relationship established in 1986.',
      socials:[{ platform:'City Website', url:'https://www.georgetownky.gov', label:'georgetownky.gov', icon:'🔗' }],
      events:[
        { date:'Jul 22 2025', text:'Special Sister City Committee meeting held — only the second special meeting of 2025.', url:'https://www.georgetownky.gov/AgendaCenter/ViewFile/Minutes/_07222025-235', summary:'A special meeting of the Georgetown Sister City Committee was held July 22, 2025 — a standalone session separate from the regular City Council calendar. The meeting\'s specific agenda was not detailed in available minutes, but the committee\'s founding is tied to the 1986 Toyota groundbreaking that transformed Georgetown\'s economy.' },
      ],
      stats:[{ val:'1986', lbl:'Established' }]
    }]},

  { id:'baa', name:'Board of Assessment Appeals', phone:'502-863-9800', icon:'🏠', icoc:'di-gd', group:'county-boards',
    desc:'KRS 133.020. Hears appeals of property assessments by the PVA. Members must own real property in Scott County 5+ years.',
    members:[{
      name:'Board of Assessment Appeals', ini:'BA', av:'av-gd', title:'Quasi-Judicial Board', tags:['t-board','t-finance','t-county'],
      ph:'502-863-9800', f:'verified',
      notes:'KRS 133.020 authority. Hears PVA assessment appeals. Members: reputable real property owners in Scott County for 5+ years prior to appointment.',
      bio:'The Board of Assessment Appeals operates under KRS 133.020 and hears appeals of property valuations made by the Scott County Property Valuation Administrator (PVA). Georgetown residents who believe their property has been over-assessed can appeal to this Board before pursuing further legal remedies. Board members must be reputable real property owners in Scott County for at least 5 years preceding their appointment.',
      positionSummary:'Under KRS 133.020, hears and decides appeals of real property assessments made by the Scott County PVA. Provides property owners an administrative remedy before litigation. Decisions may be further appealed to the Scott County Circuit Court.',
      socials:[
        { platform:'Boards Page', url:'https://www.georgetownky.gov/2221/Boards-and-Commissions', label:'Official Board Info', icon:'📋' },
        { platform:'Scott Co. PVA', url:'https://scottkypva.com/', label:'scottkypva.com', icon:'🔗' }
      ],
      events:[],
      stats:[{ val:'KRS 133.020', lbl:'Authority' }]
    }]},

  { id:'construction-appeals', name:'Construction Board of Appeals', phone:'502-863-9802', icon:'🏗️', icoc:'di-x', group:'county-boards',
    desc:'KRS 65.8808. 7 members (5 + 2 alternates). Hears code citation appeals and issues remedial orders.',
    members:[{
      name:'Construction Board of Appeals', ini:'CB', av:'av-t', title:'Quasi-Judicial Board', tags:['t-board','t-admin'],
      ph:'502-863-9802', f:'verified',
      notes:'KRS 65.8808. 7 members: 5 regular + 2 alternates. Jurisdiction: Georgetown, Sadieville, Stamping Ground, Scott County (2016 Interlocal). Issues remedial orders, imposes civil fines.',
      bio:'The Construction Board of Appeals operates under KRS 65.8808 and serves as the appellate and enforcement body for the joint code enforcement program established by the 2016 Interlocal Agreement between Georgetown, Sadieville, Stamping Ground, and Scott County. The Board issues remedial orders and can impose civil fines to ensure compliance with local codes, and hears appeals from property owners who contest code violation citations. It has 7 total members — 5 regular and 2 alternates.',
      positionSummary:'Under KRS 65.8808, issues remedial orders and imposes civil fines to ensure Georgetown Code of Ordinances compliance. Hears appeals of code violation citations. Serves four jurisdictions under the 2016 Interlocal Agreement. Members must reside within the jurisdiction they represent.',
      socials:[{ platform:'Boards Page', url:'https://www.georgetownky.gov/2221/Boards-and-Commissions', label:'Official Board Info', icon:'📋' }],
      events:[],
      stats:[{ val:'7', lbl:'Members' },{ val:'KRS 65.8808', lbl:'Authority' },{ val:'4', lbl:'Jurisdictions' }]
    }]},

  { id:'scott-county-fiscal-court', name:'Scott County Fiscal Court', phone:'502-863-7850', icon:'🏛️', icoc:'di-gd', group:'county-govt',
    desc:'County legislative and executive body. Judge/Executive, 3 Magistrates. Partners with Georgetown on EMS, airport, planning, roads.',
    members:[
      { name:'Scott County Judge/Executive', ini:'JE', av:'av-gd', title:'County Judge/Executive', tags:['t-county','t-regional'],
        ph:'502-863-7850', f:'updated',
        notes:'Chief executive of Scott County. Partners with Georgetown on EMS station, airport, rural road program, GSCPC.',
        bio:'The Scott County Judge/Executive serves as the chief executive officer of Scott County government, presiding over the Fiscal Court and administering county operations. Georgetown city government partners with the Scott County Fiscal Court on numerous intergovernmental matters including the jointly-funded EMS station (FY25 CIP), the Georgetown-Scott County Regional Airport Board, the Georgetown-Scott County Planning Commission, the Rural Secondary Road Program, stormwater KPDES co-permittee status, and the joint Code Enforcement Board.',
        positionSummary:'Presides over Scott County Fiscal Court (county legislature), administers county government including Road Department, EMS, Detention Center, and Clerk. Partners with Georgetown on airport, planning commission, EMS station, road programs, and stormwater co-permittee obligations.',
        socials:[{ platform:'Scott County Gov', url:'https://scottky.gov/', label:'scottky.gov', icon:'🔗' }],
        events:[
          { date:'FY2025', text:'Co-funded new EMS station construction with Georgetown as part of joint capital investment.', url:'https://scottky.gov/', summary:'Scott County Fiscal Court co-funded the construction of a new EMS station with the City of Georgetown in the FY2025 capital budget, reflecting the ongoing intergovernmental partnership on emergency services. The station will improve ALS response times across a growing coverage area.' },
          { date:'2024', text:'~503-acre Western Expansion Area option contract — Fiscal Court holds option for potential regional business park.', url:'https://www.georgetownky.gov/DocumentCenter/View/2840', summary:'At a July 2024 City Council Q&A session, it was disclosed that Scott County Fiscal Court holds an option contract on approximately 503 acres in Georgetown\'s Western Expansion Area for a potential regional business park. This represents one of the most significant potential economic development sites in the region.' },
        ],
        stats:[{ val:'KRS 67', lbl:'Authority' }]
      },
      { name:'Scott County Road Department', ini:'RD', av:'av-p', title:'County Department', tags:['t-county','t-pw'],
        ph:'502-863-7850', f:'updated',
        notes:'Administers Rural Secondary Road Program. Lisle Rd $169,538 and Lemons Mill Rd $94,626 approved Mar 2021.',
        bio:'The Scott County Road Department administers the Rural Secondary Road Program which allocates state transportation funds to county roads. Georgetown City Council has voted to accept road program allocations for city streets — including Lisle Road ($169,538) and Lemons Mill Road ($94,626) approved March 22, 2021 — coordinating with KYTC District 7 on project implementation.',
        positionSummary:'Maintains county road network, administers Rural Secondary Road Program allocations, coordinates with KYTC District 7, manages bridges, and partners with Georgetown on road improvement projects serving both city and county residents.',
        socials:[],
        events:[
          { date:'Mar 22 2021', text:'Rural road allocations accepted by City Council: Lisle Road $169,538 and Lemons Mill Road $94,626.', url:'https://www.georgetownky.gov/AgendaCenter', summary:'Georgetown City Council accepted Rural Secondary Road Program allocations for two road improvement projects at the March 22, 2021 regular meeting: $169,538 for Lisle Road and $94,626 for Lemons Mill Road. These state-administered funds were presented by a KYTC District 7 representative.' },
        ],
        stats:[{ val:'Rural Secondary', lbl:'Road Program' }]
      },
      { name:'Scott County EMS', ini:'SE', av:'av-r', title:'County EMS', tags:['t-county','t-ems','t-fire'],
        ph:'502-863-7850', f:'updated',
        notes:'County-level EMS distinct from Georgetown Fire & Rescue EMS. Joint new station FY25.',
        bio:'Scott County EMS is the county-level emergency medical service, distinct from the Georgetown city EMS operations embedded within Georgetown Fire & Rescue. Both services partner on mutual aid coverage and share the jointly-funded new EMS station included in the FY2025 Capital Improvement Program. Scott County EMS is administered through the Scott County Fiscal Court.',
        positionSummary:'Provides county-wide ALS/BLS emergency medical services, coordinates mutual aid with Georgetown Fire & Rescue, and participates in the jointly-funded EMS station capital project.',
        socials:[{ platform:'Scott County', url:'https://scottky.gov/', label:'scottky.gov', icon:'🔗' }],
        events:[],
        stats:[]
      },
      { name:'Scott County Detention Center', ini:'DC', av:'av-b', title:'County Department', tags:['t-county','t-police'],
        ph:'502-863-7850', f:'updated',
        notes:'County jail. Houses Georgetown Police arrestees. Administered by Scott County Fiscal Court.',
        bio:'The Scott County Detention Center is administered by the Scott County Fiscal Court and houses individuals arrested by Georgetown Police, Scott County Sheriff\'s Office, and Kentucky State Police operating in Scott County. Georgetown Police coordinate with the Detention Center for booking and transfer of arrested individuals.',
        positionSummary:'Administers the county jail facility, manages inmate intake and release, coordinates with Georgetown Police and Scott County Sheriff for booking, and oversees inmate programs and facility operations.',
        socials:[],
        events:[],
        stats:[]
      },
    ]},

  { id:'scott-county-clerk', name:'Scott County Clerk', phone:'502-863-7875', icon:'📜', icoc:'di-x', group:'county-govt',
    desc:'Holder of most Scott County public records: deeds, court records, vehicle titles, elections. 101 E Main St.',
    members:[{
      name:'Scott County Clerk', ini:'CC', av:'av-t', title:'Elected County Official', tags:['t-county','t-admin'],
      ph:'502-863-7875', f:'verified',
      notes:'101 N Court Street, Georgetown. Custodian of deeds, mortgages, court records, vehicle transfers. Up to 5 deeds/day searchable free at ecclix.com.',
      bio:'The Scott County Clerk is an elected official serving as the custodian of most public records in Scott County, including property deeds, mortgages, court records, vehicle titles, and elections records. The Clerk\'s office is a primary source for property ownership research in Georgetown and Scott County. Up to 5 deeds per day can be searched free of charge through ecclix.com. The office also processes vehicle title transfers and manages election administration.',
      positionSummary:'Custodian of all official Scott County records including property deeds, mortgages, court records, vehicle titles, and election records. Administers county elections, processes deed recordings, and maintains the public record available under Kentucky open records law.',
      socials:[
        { platform:'Scott Co. Clerk', url:'https://scottcountyclerk.ky.gov/', label:'scottcountyclerk.ky.gov', icon:'🔗' },
        { platform:'Deed Search', url:'https://www.ecclix.com/ecclix/Residential/Signup.aspx?id=scott', label:'Free Deed Search (5/day)', icon:'📄' }
      ],
      events:[],
      stats:[{ val:'101 N Court', lbl:'Location' },{ val:'Public', lbl:'Records Access' }]
    }]},

  { id:'scott-pva', name:'Scott County Property Valuation Administrator', phone:'502-863-7885', icon:'📊', icoc:'di-gd', group:'county-govt',
    desc:'101 E Main St Suite 203-206. Assesses all real and tangible property for tax purposes. qPublic database searchable online.',
    members:[{
      name:'Scott County PVA', ini:'PV', av:'av-gd', title:'Elected County Official', tags:['t-county','t-finance'],
      ph:'502-863-7885', f:'verified',
      notes:'101 E Main Street, Suite 203-206. Mon–Fri 8:30am–4:30pm. Real property, tangible property, motor vehicles, homestead exemptions. Free qPublic database at scottkypva.com.',
      bio:'The Scott County Property Valuation Administrator (PVA) is an elected official responsible for assessing the fair market value of all real and tangible property in Scott County for property tax purposes. The office maintains a free public database at scottkypva.com and through qPublic (Schneidercorp), allowing property owners and researchers to look up valuations, tax history, and parcel data. The PVA office also administers homestead exemptions for primary residences. Georgetown residents pay both city and county property taxes based on the PVA\'s assessments.',
      positionSummary:'Assesses fair market value of all real and tangible property in Scott County for tax purposes. Administers homestead exemptions, maintains open records property database, and provides the assessment data used by the City of Georgetown, Scott County, and Scott County School District to calculate property tax bills.',
      socials:[
        { platform:'PVA Website', url:'https://scottkypva.com/', label:'scottkypva.com', icon:'🔗' },
        { platform:'qPublic Search', url:'https://qpublic.schneidercorp.com/Application.aspx?AppID=948&LayerID=18565&PageTypeID=2&PageID=8263', label:'Property Search (qPublic)', icon:'🔍' }
      ],
      events:[],
      stats:[{ val:'101 E Main', lbl:'Suite 203-206' },{ val:'Free', lbl:'Public Database' }]
    }]},

  { id:'scott-county-sheriff', name:'Scott County Sheriff', phone:'502-863-7855', icon:'⭐', icoc:'di-b', group:'county-govt',
    desc:'Elected. Law enforcement and property tax collection. Works alongside Georgetown Police in Scott County.',
    members:[{
      name:'Scott County Sheriff', ini:'SH', av:'av-b', title:'Elected County Official', tags:['t-county','t-police'],
      ph:'502-863-7855', f:'updated',
      notes:'Elected sheriff. Collects county property taxes. Law enforcement jurisdiction covers unincorporated Scott County; Georgetown Police covers city limits.',
      bio:'The Scott County Sheriff is an elected official with dual responsibilities: law enforcement throughout Scott County (including unincorporated areas outside Georgetown city limits) and collection of county property tax bills. The Sheriff\'s office works alongside Georgetown Police and coordinates with Scott County Fiscal Court. For property owners who believe their tax bill is incorrect, the Sheriff refers them to the Scott County PVA at 502-863-7885 — the Sheriff does not assess property values.',
      positionSummary:'Elected law enforcement officer for Scott County. Provides patrol in unincorporated areas, collects county property tax bills, serves civil process, coordinates mutual aid with Georgetown Police, and operates the county civil and criminal process.',
      socials:[{ platform:'Sheriff Website', url:'https://scottsheriffky.com/', label:'scottsheriffky.com', icon:'🔗' }],
      events:[],
      stats:[{ val:'Elected', lbl:'Position Type' }]
    }]},

  { id:'gsc-revenue', name:'Georgetown-Scott County Revenue Commission', phone:'502-603-5860', icon:'💰', icoc:'di-gd', group:'county-govt',
    desc:'230 E Main St. Administers occupational tax for City, County, and School District. Website: gscrevenueky.gov.',
    members:[{
      name:'Revenue Commission', ini:'RC', av:'av-gd', title:'Tri-jurisdictional Tax Administration', tags:['t-county','t-finance','t-regional'],
      ph:'502-603-5860', f:'verified',
      notes:'230 E Main St, Georgetown. Administers occupational license tax (net profits and wages) for three entities: City of Georgetown, Scott County, and Scott County School District. Website: gscrevenueky.gov.',
      bio:'The Georgetown-Scott County Revenue Commission administers occupational tax laws for three taxing entities: the City of Georgetown, Scott County Fiscal Court, and the Scott County School District. All businesses and employees in Georgetown must file occupational tax returns with this Commission. Devon Golden served as attorney to the Revenue Commission before her promotion to CAO. The Commission\'s website at gscrevenueky.gov provides forms, filing instructions, and rate information.',
      positionSummary:'Administers collection of occupational license taxes (both net profits from businesses and wages from employees) on behalf of the City of Georgetown, Scott County, and Scott County School District. Processes tax returns, issues refunds, conducts audits, and maintains taxpayer accounts.',
      socials:[
        { platform:'Revenue Commission', url:'https://www.gscrevenueky.gov/', label:'gscrevenueky.gov', icon:'🔗' }
      ],
      events:[
        { date:'2019–2023', text:'Devon Golden served as Revenue Commission attorney before becoming Georgetown City Attorney, then CAO.', url:'https://www.gscrevenueky.gov/', summary:'Devon Golden, now Georgetown\'s Chief Administrative Officer, previously served as attorney to the Georgetown-Scott County Revenue Commission — giving her unique multi-jurisdictional perspective on local tax administration before her 2019 appointment as City Attorney and 2023 promotion to CAO.' },
      ],
      stats:[{ val:'3', lbl:'Jurisdictions' },{ val:'230 E Main', lbl:'Location' }]
    }]},
];

export const GRPORD = ['leadership','police','fire','pw','legal','admin','committees'];
export const GRPLBL = { leadership:'City Leadership', police:'Police & Emergency Services', fire:'Fire & EMS', pw:'Public Works & Engineering', legal:'Legal', admin:'Administration, Finance & Staff', committees:'City Council Committees' };
