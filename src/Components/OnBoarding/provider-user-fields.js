export default [
  {
    id: "email",
    title: "Email",
    placeholder: "Enter Email Address",
    type: "input",
    email: true,
    required: true,
  },
  {
    id: "mobile",
    title: "Mobile Number",
    placeholder: "Enter Mobile Number",
    type: "number",
    value: "+91",  
    prefix: "+91",
    mobile: true,
    maxLength: 10,
    required: true,
    attributes: {
      readonlyPrefix: true
    }
  },
  {
    id: "name",
    title: "Name",
    placeholder: "Enter Full Name",
    type: "input",
    required: true,
  },
];
