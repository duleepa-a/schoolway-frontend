export const applicationsData = [
  {
    Name: "Kasun Perera",
    User_ID: "A1001",
    Date: "2025-01-15",
    Status: "Pending",
    Email: "kasun.perera@example.com",
    Phone: "+94771234567",
    Experience: "5 years",
    PoliceReportDocument: "/dummy_data/documents/police_report_sample.pdf",
    MedicalReportDocument: "/dummy_data/documents/medical_report_sample.pdf"
  },
  {
    Name: "Nuwan Silva",
    User_ID: "A1002",
    Date: "2025-01-14",
    Status: "Pending",
    Email: "nuwan.silva@example.com",
    Phone: "+94772345678",
    Experience: "3 years",
  },
  {
    Name: "Mahesh Fernando",
    User_ID: "A1003",
    Date: "2025-01-13",
    Status: "Approved",
    Email: "mahesh.fernando@example.com",
    Phone: "+94773456789",
    Experience: "7 years",
    PoliceReportDocument: "/dummy_data/documents/police_report_sample.pdf",
    MedicalReportDocument: "/dummy_data/documents/medical_report_sample.pdf"
  },
  {
    Name: "Chaminda Rajapaksha",
    User_ID: "A1004",
    Date: "2025-01-12",
    Status: "Rejected",
    Email: "chaminda.raja@example.com",
    Phone: "+94774567890",
    Experience: "2 years",
  },
  {
    Name: "Isuru Wickramasinghe",
    User_ID: "A1005",
    Date: "2025-01-11",
    Status: "Pending",
    Email: "isuru.wickrama@example.com",
    Phone: "+94775678901",
    Experience: "4 years",
  },
  {
    Name: "Sandun Jayawardena",
    User_ID: "A1006",
    Date: "2025-01-10",
    Status: "Pending",
    Email: "sandun.jaya@example.com",
    Phone: "+94776789012",
    Experience: "6 years",
  },
  {
    Name: "Lakmal Gunasekara",
    User_ID: "A1007",
    Date: "2025-01-09",
    Status: "Approved",
    Email: "lakmal.guna@example.com",
    Phone: "+94777890123",
    Experience: "8 years",
  },
  {
    Name: "Roshan Mendis",
    User_ID: "A1008",
    Date: "2025-01-08",
    Status: "Pending",
    Email: "roshan.mendis@example.com",
    Phone: "+94778901234",
    Experience: "3 years",
  },
  {
    Name: "Thilina Herath",
    User_ID: "A1009",
    Date: "2025-01-07",
    Status: "Rejected",
    Email: "thilina.herath@example.com",
    Phone: "+94779012345",
    Experience: "1 year",
  },
  {
    Name: "Chathura Wijesinghe",
    User_ID: "A1010",
    Date: "2025-01-06",
    Status: "Pending",
    Email: "chathura.wije@example.com",
    Phone: "+94770123456",
    Experience: "5 years",
  },
  {
    Name: "Dilan Perera",
    User_ID: "A1011",
    Date: "2025-01-05",
    Status: "Approved",
    Email: "dilan.perera@example.com",
    Phone: "+94771234560",
    Experience: "4 years",
  },
  {
    Name: "Gayan Silva",
    User_ID: "A1012",
    Date: "2025-01-04",
    Status: "Pending",
    Email: "gayan.silva@example.com",
    Phone: "+94772345601",
    Experience: "6 years",
  },
  {
    Name: "Pradeep Fernando",
    User_ID: "A1013",
    Date: "2025-01-03",
    Status: "Rejected",
    Email: "pradeep.fernando@example.com",
    Phone: "+94773456012",
    Experience: "2 years",
  },
  {
    Name: "Janaka Rathnayake",
    User_ID: "A1014",
    Date: "2025-01-02",
    Status: "Pending",
    Email: "janaka.rathna@example.com",
    Phone: "+94774560123",
    Experience: "7 years",
  },
  {
    Name: "Tharindu Jayasuriya",
    User_ID: "A1015",
    Date: "2025-01-01",
    Status: "Approved",
    Email: "tharindu.jaya@example.com",
    Phone: "+94775601234",
    Experience: "9 years",
  },
];

export type ApplicationData = {
  Name: string;
  User_ID: string;
  Date: string;
  Status: "Pending" | "Approved" | "Rejected";
  Email: string;
  Phone: string;
  Experience: string;
  PoliceReportDocument?: string;
  MedicalReportDocument?: string;
};
