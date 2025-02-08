const logout = document.getElementById("logoutBtn");

logout.addEventListener("click", () => {
  console.log("clicked");
  localStorage.removeItem("user");
  window.location.href = "./index.html";
});
