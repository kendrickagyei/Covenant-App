const data = {
  "church_expense_tracker": {
    "congregation": "Presbyterian Church of Ghana — Covenant Family",
    "currency": "GHS",
    "period": "January–June 2026",
    "schema": {
      "id": "Unique transaction ID",
      "date": "ISO 8601 date (YYYY-MM-DD)",
      "type": "income | expense",
      "category": "Primary classification (Offertory, Tithe, Welfare, Dues, Kuntunse Project, Utilities, Transport, Harvest, Evangelism, Maintenance, Catering, Equipment, Stationery, Salaries, Others)",
      "subcategory": "Specific sub-type within category",
      "amount": "Numeric value in GHS",
      "remarks": "Free-text description",
      "recorded_by": "Person or committee who recorded the entry"
    },
    "records": [
      {
        "id": "001",
        "date": "2026-01-04",
        "type": "income",
        "category": "Offertory",
        "subcategory": "Sunday Offertory",
        "amount": 1850,
        "remarks": "First Sunday offertory — January",
        "recorded_by": "Treasurer"
      },
      {
        "id": "002",
        "date": "2026-01-05",
        "type": "expense",
        "category": "Utilities",
        "subcategory": "Electricity",
        "amount": 420,
        "remarks": "ECG bill payment — January",
        "recorded_by": "Treasurer"
      },
      {
        "id": "003",
        "date": "2026-01-08",
        "type": "income",
        "category": "Tithe",
        "subcategory": "Weekly Tithe",
        "amount": 3200,
        "remarks": "Tithe collection — second Sunday",
        "recorded_by": "Treasurer"
      },
      {
        "id": "004",
        "date": "2026-01-11",
        "type": "expense",
        "category": "Welfare",
        "subcategory": "Bereavement Support",
        "amount": 600,
        "remarks": "Support for bereaved church family — Mensah household",
        "recorded_by": "Welfare Committee"
      },
      {
        "id": "005",
        "date": "2026-01-14",
        "type": "income",
        "category": "Dues",
        "subcategory": "Monthly Dues",
        "amount": 980,
        "remarks": "January member dues collection",
        "recorded_by": "Financial Secretary"
      },
      {
        "id": "006",
        "date": "2026-01-15",
        "type": "expense",
        "category": "Stationery",
        "subcategory": "Printed Materials",
        "amount": 180,
        "remarks": "Sunday bulletins and order of service printing",
        "recorded_by": "Secretary"
      },
      {
        "id": "007",
        "date": "2026-01-18",
        "type": "income",
        "category": "Offertory",
        "subcategory": "Sunday Offertory",
        "amount": 2100,
        "remarks": "Third Sunday offertory — January",
        "recorded_by": "Treasurer"
      },
      {
        "id": "008",
        "date": "2026-01-20",
        "type": "expense",
        "category": "Maintenance",
        "subcategory": "Audio Visual",
        "amount": 750,
        "remarks": "PA system speaker repair",
        "recorded_by": "Treasurer"
      },
      {
        "id": "009",
        "date": "2026-01-25",
        "type": "income",
        "category": "Harvest",
        "subcategory": "Thanksgiving Harvest",
        "amount": 5400,
        "remarks": "Annual January harvest thanksgiving",
        "recorded_by": "Harvest Committee"
      },
      {
        "id": "010",
        "date": "2026-01-28",
        "type": "expense",
        "category": "Transport",
        "subcategory": "Pastor Allowance",
        "amount": 200,
        "remarks": "Pastor's monthly fuel allowance — January",
        "recorded_by": "Treasurer"
      },
      {
        "id": "011",
        "date": "2026-01-30",
        "type": "expense",
        "category": "Welfare",
        "subcategory": "Hospital Support",
        "amount": 350,
        "remarks": "Medical support for hospitalised member — Sister Ama",
        "recorded_by": "Welfare Committee"
      },
      {
        "id": "012",
        "date": "2026-02-01",
        "type": "income",
        "category": "Offertory",
        "subcategory": "Sunday Offertory",
        "amount": 1950,
        "remarks": "First Sunday offertory — February",
        "recorded_by": "Treasurer"
      },
      {
        "id": "013",
        "date": "2026-02-04",
        "type": "expense",
        "category": "Utilities",
        "subcategory": "Water Bill",
        "amount": 180,
        "remarks": "GWCL water bill — February",
        "recorded_by": "Treasurer"
      },
      {
        "id": "014",
        "date": "2026-02-08",
        "type": "income",
        "category": "Tithe",
        "subcategory": "Weekly Tithe",
        "amount": 2850,
        "remarks": "Tithe collection — second Sunday February",
        "recorded_by": "Treasurer"
      },
      {
        "id": "015",
        "date": "2026-02-10",
        "type": "expense",
        "category": "Evangelism",
        "subcategory": "Outreach Materials",
        "amount": 500,
        "remarks": "Tracts, flyers and outreach stationery",
        "recorded_by": "Evangelism Committee"
      },
      {
        "id": "016",
        "date": "2026-02-12",
        "type": "income",
        "category": "Dues",
        "subcategory": "Monthly Dues",
        "amount": 1050,
        "remarks": "February member dues collection",
        "recorded_by": "Financial Secretary"
      },
      {
        "id": "017",
        "date": "2026-02-14",
        "type": "income",
        "category": "Others",
        "subcategory": "Special Freewill Offering",
        "amount": 1500,
        "remarks": "Valentine charity freewill offering",
        "recorded_by": "Treasurer"
      },
      {
        "id": "018",
        "date": "2026-02-18",
        "type": "expense",
        "category": "Welfare",
        "subcategory": "Hospital Support",
        "amount": 450,
        "remarks": "Hospital visit gift basket for sick member",
        "recorded_by": "Welfare Committee"
      },
      {
        "id": "019",
        "date": "2026-02-22",
        "type": "income",
        "category": "Offertory",
        "subcategory": "Sunday Offertory",
        "amount": 2000,
        "remarks": "Fourth Sunday offertory — February",
        "recorded_by": "Treasurer"
      },
      {
        "id": "020",
        "date": "2026-02-25",
        "type": "expense",
        "category": "Maintenance",
        "subcategory": "Building Repairs",
        "amount": 320,
        "remarks": "Repainting of children's Sunday school room",
        "recorded_by": "Treasurer"
      },
      {
        "id": "021",
        "date": "2026-02-27",
        "type": "expense",
        "category": "Stationery",
        "subcategory": "Administrative",
        "amount": 140,
        "remarks": "Receipt books and offering envelopes restock",
        "recorded_by": "Secretary"
      },
      {
        "id": "022",
        "date": "2026-02-28",
        "type": "expense",
        "category": "Transport",
        "subcategory": "Pastor Allowance",
        "amount": 200,
        "remarks": "Pastor's monthly fuel allowance — February",
        "recorded_by": "Treasurer"
      },
      {
        "id": "023",
        "date": "2026-03-01",
        "type": "income",
        "category": "Offertory",
        "subcategory": "Sunday Offertory",
        "amount": 2250,
        "remarks": "First Sunday offertory — March",
        "recorded_by": "Treasurer"
      },
      {
        "id": "024",
        "date": "2026-03-05",
        "type": "expense",
        "category": "Utilities",
        "subcategory": "Electricity",
        "amount": 410,
        "remarks": "ECG bill payment — March",
        "recorded_by": "Treasurer"
      },
      {
        "id": "025",
        "date": "2026-03-08",
        "type": "income",
        "category": "Others",
        "subcategory": "Women's Fellowship Offering",
        "amount": 1100,
        "remarks": "Women's day fundraising contributions",
        "recorded_by": "Women's Fellowship"
      },
      {
        "id": "026",
        "date": "2026-03-10",
        "type": "expense",
        "category": "Welfare",
        "subcategory": "Widow Support",
        "amount": 700,
        "remarks": "Monthly welfare support for widow in congregation",
        "recorded_by": "Welfare Committee"
      },
      {
        "id": "027",
        "date": "2026-03-12",
        "type": "income",
        "category": "Dues",
        "subcategory": "Monthly Dues",
        "amount": 1020,
        "remarks": "March member dues collection",
        "recorded_by": "Financial Secretary"
      },
      {
        "id": "028",
        "date": "2026-03-15",
        "type": "income",
        "category": "Tithe",
        "subcategory": "Weekly Tithe",
        "amount": 3100,
        "remarks": "Mid-month tithe and pledges — March",
        "recorded_by": "Treasurer"
      },
      {
        "id": "029",
        "date": "2026-03-18",
        "type": "expense",
        "category": "Catering",
        "subcategory": "Fellowship Meal",
        "amount": 620,
        "remarks": "Women's day anniversary lunch catering",
        "recorded_by": "Catering Committee"
      },
      {
        "id": "030",
        "date": "2026-03-22",
        "type": "income",
        "category": "Offertory",
        "subcategory": "Sunday Offertory",
        "amount": 2400,
        "remarks": "Fourth Sunday offertory — March",
        "recorded_by": "Treasurer"
      },
      {
        "id": "031",
        "date": "2026-03-24",
        "type": "expense",
        "category": "Equipment",
        "subcategory": "Audio Visual",
        "amount": 1800,
        "remarks": "New projector purchase for sanctuary",
        "recorded_by": "Treasurer"
      },
      {
        "id": "032",
        "date": "2026-03-28",
        "type": "expense",
        "category": "Evangelism",
        "subcategory": "Easter Outreach",
        "amount": 350,
        "remarks": "Easter outreach planning and printed materials",
        "recorded_by": "Evangelism Committee"
      },
      {
        "id": "033",
        "date": "2026-03-31",
        "type": "expense",
        "category": "Transport",
        "subcategory": "Pastor Allowance",
        "amount": 200,
        "remarks": "Pastor's monthly fuel allowance — March",
        "recorded_by": "Treasurer"
      },
      {
        "id": "034",
        "date": "2026-04-05",
        "type": "income",
        "category": "Offertory",
        "subcategory": "Easter Sunday Offertory",
        "amount": 6800,
        "remarks": "Good Friday and Easter Sunday combined offertory",
        "recorded_by": "Treasurer"
      },
      {
        "id": "035",
        "date": "2026-04-06",
        "type": "expense",
        "category": "Catering",
        "subcategory": "Fellowship Meal",
        "amount": 950,
        "remarks": "Easter Sunday fellowship meal catering",
        "recorded_by": "Catering Committee"
      },
      {
        "id": "036",
        "date": "2026-04-07",
        "type": "expense",
        "category": "Utilities",
        "subcategory": "Internet",
        "amount": 230,
        "remarks": "Monthly internet subscription — April",
        "recorded_by": "Treasurer"
      },
      {
        "id": "037",
        "date": "2026-04-10",
        "type": "income",
        "category": "Tithe",
        "subcategory": "Weekly Tithe",
        "amount": 2700,
        "remarks": "Tithe collection — second Sunday April",
        "recorded_by": "Treasurer"
      },
      {
        "id": "038",
        "date": "2026-04-12",
        "type": "income",
        "category": "Dues",
        "subcategory": "Monthly Dues",
        "amount": 990,
        "remarks": "April member dues collection",
        "recorded_by": "Financial Secretary"
      },
      {
        "id": "039",
        "date": "2026-04-13",
        "type": "expense",
        "category": "Maintenance",
        "subcategory": "Generator",
        "amount": 540,
        "remarks": "Generator servicing and fuel top-up",
        "recorded_by": "Treasurer"
      },
      {
        "id": "040",
        "date": "2026-04-17",
        "type": "expense",
        "category": "Welfare",
        "subcategory": "Education Support",
        "amount": 800,
        "remarks": "School fees support for student member",
        "recorded_by": "Welfare Committee"
      },
      {
        "id": "041",
        "date": "2026-04-19",
        "type": "income",
        "category": "Offertory",
        "subcategory": "Sunday Offertory",
        "amount": 2150,
        "remarks": "Third Sunday offertory — April",
        "recorded_by": "Treasurer"
      },
      {
        "id": "042",
        "date": "2026-04-23",
        "type": "income",
        "category": "Kuntunse Project",
        "subcategory": "Project Levy",
        "amount": 3500,
        "remarks": "Monthly Kuntunse chapel project levy contributions",
        "recorded_by": "Project Committee"
      },
      {
        "id": "043",
        "date": "2026-04-26",
        "type": "income",
        "category": "Others",
        "subcategory": "Anonymous Donation",
        "amount": 2000,
        "remarks": "Anonymous donation towards building fund",
        "recorded_by": "Treasurer"
      },
      {
        "id": "044",
        "date": "2026-04-30",
        "type": "expense",
        "category": "Transport",
        "subcategory": "Pastor Allowance",
        "amount": 200,
        "remarks": "Pastor's monthly fuel allowance — April",
        "recorded_by": "Treasurer"
      },
      {
        "id": "045",
        "date": "2026-05-03",
        "type": "income",
        "category": "Offertory",
        "subcategory": "Sunday Offertory",
        "amount": 2050,
        "remarks": "First Sunday offertory — May",
        "recorded_by": "Treasurer"
      },
      {
        "id": "046",
        "date": "2026-05-06",
        "type": "expense",
        "category": "Utilities",
        "subcategory": "Electricity",
        "amount": 400,
        "remarks": "ECG bill payment — May",
        "recorded_by": "Treasurer"
      },
      {
        "id": "047",
        "date": "2026-05-10",
        "type": "income",
        "category": "Tithe",
        "subcategory": "Weekly Tithe",
        "amount": 2950,
        "remarks": "Tithe collection — second Sunday May",
        "recorded_by": "Treasurer"
      },
      {
        "id": "048",
        "date": "2026-05-11",
        "type": "expense",
        "category": "Welfare",
        "subcategory": "Mother's Day Hampers",
        "amount": 550,
        "remarks": "Mother's day hampers for elderly women in congregation",
        "recorded_by": "Welfare Committee"
      },
      {
        "id": "049",
        "date": "2026-05-14",
        "type": "income",
        "category": "Dues",
        "subcategory": "Monthly Dues",
        "amount": 1010,
        "remarks": "May member dues collection",
        "recorded_by": "Financial Secretary"
      },
      {
        "id": "050",
        "date": "2026-05-17",
        "type": "income",
        "category": "Offertory",
        "subcategory": "Sunday Offertory",
        "amount": 2200,
        "remarks": "Third Sunday offertory — May",
        "recorded_by": "Treasurer"
      },
      {
        "id": "051",
        "date": "2026-05-20",
        "type": "expense",
        "category": "Evangelism",
        "subcategory": "Community Outreach",
        "amount": 480,
        "remarks": "Community health screening support and gospel sharing",
        "recorded_by": "Evangelism Committee"
      },
      {
        "id": "052",
        "date": "2026-05-23",
        "type": "expense",
        "category": "Maintenance",
        "subcategory": "Building Repairs",
        "amount": 670,
        "remarks": "Roofing repair — leaking section of main hall",
        "recorded_by": "Treasurer"
      },
      {
        "id": "053",
        "date": "2026-05-27",
        "type": "income",
        "category": "Kuntunse Project",
        "subcategory": "Project Levy",
        "amount": 3500,
        "remarks": "May Kuntunse chapel project levy contributions",
        "recorded_by": "Project Committee"
      },
      {
        "id": "054",
        "date": "2026-05-31",
        "type": "expense",
        "category": "Transport",
        "subcategory": "Pastor Allowance",
        "amount": 200,
        "remarks": "Pastor's monthly fuel allowance — May",
        "recorded_by": "Treasurer"
      },
      {
        "id": "055",
        "date": "2026-06-01",
        "type": "expense",
        "category": "Salaries",
        "subcategory": "Church Worker Salary",
        "amount": 1200,
        "remarks": "Monthly salary for church caretaker/janitor",
        "recorded_by": "Treasurer"
      },
      {
        "id": "056",
        "date": "2026-06-07",
        "type": "income",
        "category": "Offertory",
        "subcategory": "Sunday Offertory",
        "amount": 1900,
        "remarks": "First Sunday offertory — June",
        "recorded_by": "Treasurer"
      },
      {
        "id": "057",
        "date": "2026-06-08",
        "type": "expense",
        "category": "Utilities",
        "subcategory": "Electricity",
        "amount": 415,
        "remarks": "ECG bill payment — June",
        "recorded_by": "Treasurer"
      },
      {
        "id": "058",
        "date": "2026-06-10",
        "type": "income",
        "category": "Dues",
        "subcategory": "Monthly Dues",
        "amount": 960,
        "remarks": "June member dues collection",
        "recorded_by": "Financial Secretary"
      },
      {
        "id": "059",
        "date": "2026-06-14",
        "type": "income",
        "category": "Tithe",
        "subcategory": "Weekly Tithe",
        "amount": 2600,
        "remarks": "Tithe collection — second Sunday June",
        "recorded_by": "Treasurer"
      },
      {
        "id": "060",
        "date": "2026-06-18",
        "type": "expense",
        "category": "Welfare",
        "subcategory": "Bereavement Support",
        "amount": 500,
        "remarks": "Funeral support for family of late Elder Asante",
        "recorded_by": "Welfare Committee"
      },
      {
        "id": "061",
        "date": "2026-06-19",
        "type": "expense",
        "category": "Stationery",
        "subcategory": "Administrative",
        "amount": 160,
        "remarks": "Mid-year financial report printing",
        "recorded_by": "Secretary"
      },
      {
        "id": "062",
        "date": "2026-06-20",
        "type": "income",
        "category": "Offertory",
        "subcategory": "Sunday Offertory",
        "amount": 2050,
        "remarks": "Third Sunday offertory — June",
        "recorded_by": "Treasurer"
      },
      {
        "id": "063",
        "date": "2026-06-22",
        "type": "income",
        "category": "Kuntunse Project",
        "subcategory": "Special Fundraising",
        "amount": 4200,
        "remarks": "Kuntunse project special fundraising Sunday",
        "recorded_by": "Project Committee"
      },
      {
        "id": "064",
        "date": "2026-06-24",
        "type": "expense",
        "category": "Evangelism",
        "subcategory": "Mid-Year Outreach",
        "amount": 420,
        "remarks": "Mid-year evangelism campaign materials",
        "recorded_by": "Evangelism Committee"
      },
      {
        "id": "065",
        "date": "2026-06-25",
        "type": "expense",
        "category": "Transport",
        "subcategory": "Visitation",
        "amount": 180,
        "remarks": "Elders visitation transport — sick and shut-in members",
        "recorded_by": "Elders Committee"
      },
      {
        "id": "066",
        "date": "2026-06-28",
        "type": "expense",
        "category": "Catering",
        "subcategory": "Mid-Year Review",
        "amount": 520,
        "remarks": "Refreshments for mid-year congregational review meeting",
        "recorded_by": "Catering Committee"
      },
      {
        "id": "067",
        "date": "2026-06-29",
        "type": "expense",
        "category": "Others",
        "subcategory": "Presbytery Levy",
        "amount": 850,
        "remarks": "Monthly presbytery levy remittance to district",
        "recorded_by": "Treasurer"
      },
      {
        "id": "068",
        "date": "2026-06-30",
        "type": "expense",
        "category": "Transport",
        "subcategory": "Pastor Allowance",
        "amount": 200,
        "remarks": "Pastor's monthly fuel allowance — June",
        "recorded_by": "Treasurer"
      }
    ]
  }
}
export default data
