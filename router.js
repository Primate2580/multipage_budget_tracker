export function showPage() {
  // Get the hash, strip "#", default to dashboard
  let hash = window.location.hash.replace("#", "") || "dashboard";
  // Hide all pages
  let allPages = document.querySelectorAll(".page");
  allPages.forEach(function (page) {
    page.style.display = "none";
  });
  // Show the matching page
  let activePage = document.getElementById("page-" + hash);
  if (activePage) {
    activePage.style.display = "block";
  }
  // Update active nav link styling
  updateActiveNavLink(hash);
}




export function updateActiveNavLink(hash) {
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.classList.remove("text-white", "bg-zinc-800");
    link.classList.add("text-zinc-400");


    const linkHash = link.getAttribute("href").replace("#", "");


    if (linkHash === hash) {
      link.classList.remove("text-zinc-400");
      link.classList.add("text-white", "bg-zinc-800");
    }
  });
}
