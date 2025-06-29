export const orders = [
  {
    _id: "order1",
    items: [
      {
        product: {
          _id: "p1",
          name: "Chaunsa Mango 5kg",
          image: "/images/chaunsa.png",
        },
        quantity: 2,
        price: 800,
      },
      {
        product: {
          _id: "p2",
          name: "Lychee Box 2kg",
          image: "/images/lychee.png",
        },
        quantity: 1,
        price: 600,
      },
    ],
    address: {
      firstName: "Ali",
      lastName: "Raza",
      street: "12-A Canal Road",
      city: "Lahore",
      state: "Punjab",
      zipcode: "54000",
      country: "Pakistan",
    },
    amount: 2200,
    paymentType: "COD",
    orderDate: "2025-06-20",
    isPaid: false,
  },
  {
    _id: "order2",
    items: [
      {
        product: {
          _id: "p3",
          name: "Fresh Tomatoes 1kg",
          image: "/images/tomatoes.png",
        },
        quantity: 3,
        price: 100,
      },
      {
        product: {
          _id: "p4",
          name: "Green Chilies 250g",
          image: "/images/greenchili.png",
        },
        quantity: 2,
        price: 80,
      },
      {
        product: {
          _id: "p5",
          name: "Apple Golden 1kg",
          image: "/images/apple.png",
        },
        quantity: 1,
        price: 250,
      },
    ],
    address: {
      firstName: "Fatima",
      lastName: "Iqbal",
      street: "Block B, Johar Town",
      city: "Lahore",
      state: "Punjab",
      zipcode: "54782",
      country: "Pakistan",
    },
    amount: 710,
    paymentType: "Online",
    orderDate: "2025-06-22",
    isPaid: true,
  },
  {
    _id: "order3",
    items: [
      {
        product: {
          _id: "p6",
          name: "Alubukhara (Dried Plum)",
          image: "/images/alubukhara.png",
        },
        quantity: 1,
        price: 450,
      },
      {
        product: {
          _id: "p7",
          name: "Dates – Ajwa 500g",
          image: "/images/dates.png",
        },
        quantity: 2,
        price: 700,
      },
    ],
    address: {
      firstName: "Usman",
      lastName: "Khan",
      street: "House #45, Satellite Town",
      city: "Rawalpindi",
      state: "Punjab",
      zipcode: "46000",
      country: "Pakistan",
    },
    amount: 1850,
    paymentType: "COD",
    orderDate: "2025-06-21",
    isPaid: false,
  },
  {
    _id: "order4",
    items: [
      {
        product: {
          _id: "p8",
          name: "Karela 1kg",
          image: "/images/karela.png",
        },
        quantity: 2,
        price: 120,
      },
      {
        product: {
          _id: "p9",
          name: "Palak (Spinach) 1 bunch",
          image: "/images/palak.png",
        },
        quantity: 3,
        price: 50,
      },
    ],
    address: {
      firstName: "Sara",
      lastName: "Naeem",
      street: "Plot #15, Model Colony",
      city: "Karachi",
      state: "Sindh",
      zipcode: "75050",
      country: "Pakistan",
    },
    amount: 390,
    paymentType: "Online",
    orderDate: "2025-06-23",
    isPaid: true,
  },
  {
    _id: "order5",
    items: [
      {
        product: {
          _id: "p10",
          name: "Grapes Black 1kg",
          image: "/images/grapes.png",
        },
        quantity: 2,
        price: 500,
      },
      {
        product: {
          _id: "p11",
          name: "Jamun 500g",
          image: "/images/jamun.png",
        },
        quantity: 1,
        price: 400,
      },
      {
        product: {
          _id: "p12",
          name: "Dhania Bunch",
          image: "/images/dhania.png",
        },
        quantity: 3,
        price: 30,
      },
    ],
    address: {
      firstName: "Imran",
      lastName: "Ali",
      street: "Flat #302, Gulshan Heights",
      city: "Faisalabad",
      state: "Punjab",
      zipcode: "38000",
      country: "Pakistan",
    },
    amount: 1460,
    paymentType: "COD",
    orderDate: "2025-06-24",
    isPaid: false,
  },
];
