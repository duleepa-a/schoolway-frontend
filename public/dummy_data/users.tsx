export const userData = [
  {
    Name: "Ayana Fernando",
    User_ID: "U1001",
    Email: "ayana.fernando@example.com",
    Status: "Active",
    Role: "admin",
  },
  {
    Name: "Ruwan Silva",
    User_ID: "U1002",
    Email: "ruwan.silva@example.com",
    Status: "Inactive",
    Role: "van owner",
  },
  {
    Name: "Thilina Jayasuriya",
    User_ID: "U1003",
    Email: "thilina.j@example.com",
    Status: "Active",
    Role: "driver",
  },
  {
    Name: "Nadeesha Perera",
    User_ID: "U1004",
    Email: "nadeesha.perera@example.com",
    Status: "Pending",
    Role: "parent",
  },
  {
    Name: "Kavinda Mendis",
    User_ID: "U1005",
    Email: "kavinda.mendis@example.com",
    Status: "Active",
    Role: "driver",
  },
  {
    Name: "Sachini Wickramasinghe",
    User_ID: "U1006",
    Email: "sachini.w@example.com",
    Status: "Active",
    Role: "parent",
  },
  {
    Name: "Dinesh Rajapaksha",
    User_ID: "U1007",
    Email: "dinesh.raja@example.com",
    Status: "Inactive",
    Role: "van owner",
  },
  {
    Name: "Amaya Senanayake",
    User_ID: "U1008",
    Email: "amaya.senanayake@example.com",
    Status: "Active",
    Role: "admin",
  },
  {
    Name: "Priyanka Kumari",
    User_ID: "U1009",
    Email: "priyanka.kumari@example.com",
    Status: "Pending",
    Role: "parent",
  },
  {
    Name: "Chamara Wijesinghe",
    User_ID: "U1010",
    Email: "chamara.wije@example.com",
    Status: "Active",
    Role: "driver",
  },
  {
    Name: "Nishani Gunasekara",
    User_ID: "U1011",
    Email: "nishani.guna@example.com",
    Status: "Active",
    Role: "parent",
  },
  {
    Name: "Lasith Malinga",
    User_ID: "U1012",
    Email: "lasith.malinga@example.com",
    Status: "Inactive",
    Role: "van owner",
  },
  {
    Name: "Shani Mendis",
    User_ID: "U1013",
    Email: "shani.mendis@example.com",
    Status: "Active",
    Role: "driver",
  },
  {
    Name: "Dilani Rathnayake",
    User_ID: "U1014",
    Email: "dilani.rathna@example.com",
    Status: "Pending",
    Role: "parent",
  },
  {
    Name: "Sandun Perera",
    User_ID: "U1015",
    Email: "sandun.perera@example.com",
    Status: "Active",
    Role: "admin",
  },
  {
    Name: "Hasitha Bandara",
    User_ID: "U1016",
    Email: "hasitha.bandara@example.com",
    Status: "Active",
    Role: "van owner",
  },
  {
    Name: "Mihiri Samarasinghe",
    User_ID: "U1017",
    Email: "mihiri.samara@example.com",
    Status: "Inactive",
    Role: "parent",
  },
  {
    Name: "Roshan Peiris",
    User_ID: "U1018",
    Email: "roshan.peiris@example.com",
    Status: "Active",
    Role: "driver",
  },
  {
    Name: "Anushka Senarath",
    User_ID: "U1019",
    Email: "anushka.senarath@example.com",
    Status: "Pending",
    Role: "parent",
  },
  {
    Name: "Gayani Liyanage",
    User_ID: "U1020",
    Email: "gayani.liyanage@example.com",
    Status: "Active",
    Role: "admin",
  },
];

export type UserData = {
  Name: string;
  User_ID: string;
  Email: string;
  Status: "Active" | "Inactive" | "Pending";
  Role: "admin" | "van owner" | "driver" | "parent";
};
