export default async function getLogo() {
  const user_group = "88+DE"; // Replace this with the actual logic to get the user group

  switch (user_group) {
    case "88+DE":
      return "/_images/88+DE_logo.png";
    /*
    case "88+AU":
      return "/_images/88+AU_logo.png";
    case "88_shop":
      return "/_images/88_shop_logo.png";
    case "88+demo":
      return "/_images/88+demo_logo.png";
      */
    default:
      return "/_images/88+demo_logo.png";
  }
}
