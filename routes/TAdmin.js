const router = require("express").Router();

//  admin/tadmin
router.get("/", (req, res) => {
  let AdminControl = false;
  const currentUserAdmin = req.cookies.admin;
  console.log(currentUserAdmin);
  res.render("admin/topAdmin/topadminentering", {
    currentUserAdmin,
    AdminControl,
  });
});

module.exports = router;
