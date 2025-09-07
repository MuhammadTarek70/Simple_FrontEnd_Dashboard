function initData(callback) {
  let users = JSON.parse(localStorage.getItem("users")) || [];
  let posts = JSON.parse(localStorage.getItem("posts")) || [];
  let comments = JSON.parse(localStorage.getItem("comments")) || [];
  let promises = [];
  if (users.length === 0) {
    promises.push(
      $.get("https://jsonplaceholder.typicode.com/users", (d) => {
        localStorage.setItem("users", JSON.stringify(d));
      })
    );
  }
  if (posts.length === 0) {
    promises.push(
      $.get("https://jsonplaceholder.typicode.com/posts", (d) => {
        localStorage.setItem("posts", JSON.stringify(d));
      })
    );
  }
  if (comments.length === 0) {
    promises.push(
      $.get("https://jsonplaceholder.typicode.com/comments", (d) => {
        localStorage.setItem("comments", JSON.stringify(d));
      })
    );
  }
  $.when.apply($, promises).done(() => {
    if (callback) callback();
    updateDashboard();
    $("#loader").fadeOut();
  });
}

function updateDashboard() {
  let users = JSON.parse(localStorage.getItem("users")) || [];
  let posts = JSON.parse(localStorage.getItem("posts")) || [];
  let comments = JSON.parse(localStorage.getItem("comments")) || [];
  $("#userCount").text(users.length);
  $("#postCount").text(posts.length);
  $("#commentCount").text(comments.length);
}

function loadUsersTable(users) {
  let table = $("#usersTable").DataTable({
    data: users,
    destroy: true,
    columns: [
      { title: "ID", data: "id" },
      { title: "Name", data: "name" },
      { title: "Email", data: "email" },
      {
        title: "⭐ Favorite",
        data: null,
        render: (d) => {
          let favs = JSON.parse(localStorage.getItem("favorites")) || [];
          return `<button class="favUser" data-id="${d.id}">${
            favs.includes(d.id) ? "★" : "☆"
          }</button>`;
        },
      },
      {
        title: "Actions",
        data: null,
        render: (d) => `
          <button class="editUser" data-id="${d.id}">Edit</button>
          <button class="deleteUser" data-id="${d.id}">Delete</button>
        `,
      },
    ],
  });

  $("#addUserBtn").on("click", () => {
    let name = prompt("Enter name:");
    let email = prompt("Enter email:");
    if (name && email) {
      users.push({ id: Date.now(), name, email });
      localStorage.setItem("users", JSON.stringify(users));
      table.clear().rows.add(users).draw();
      updateDashboard();
      toastr.success("User added!");
    }
  });

  $("#usersTable").on("click", ".editUser", function () {
    let id = $(this).data("id");
    let user = users.find((u) => u.id === id);
    let newName = prompt("Edit name:", user.name);
    let newEmail = prompt("Edit email:", user.email);
    if (newName && newEmail) {
      user.name = newName;
      user.email = newEmail;
      localStorage.setItem("users", JSON.stringify(users));
      table.clear().rows.add(users).draw();
      updateDashboard();
      toastr.info("User updated!");
    }
  });

  $("#usersTable").on("click", ".deleteUser", function () {
    let id = $(this).data("id");
    users = users.filter((u) => u.id !== id);
    localStorage.setItem("users", JSON.stringify(users));
    table.clear().rows.add(users).draw();
    updateDashboard();
    toastr.error("User deleted!");
  });

  $("#usersTable").on("click", ".favUser", function () {
    let id = $(this).data("id");
    let favs = JSON.parse(localStorage.getItem("favorites")) || [];
    if (favs.includes(id)) {
      favs = favs.filter((f) => f !== id);
      toastr.warning("Removed from favorites!");
    } else {
      favs.push(id);
      toastr.success("Added to favorites!");
    }
    localStorage.setItem("favorites", JSON.stringify(favs));
    table.clear().rows.add(users).draw();
  });
}

function renderPosts(posts, comments) {
  function refreshList() {
    $("#postsList").html(
      posts
        .map(
          (p) => `
        <li data-id="${p.id}">
          ${p.title}
          <button class="editPost">Edit</button>
          <button class="deletePost">Delete</button>
        </li>
      `
        )
        .join("")
    );
  }
  refreshList();

  $("#searchPost").on("input", function () {
    let q = $(this).val().toLowerCase();
    $("#postsList li").each(function () {
      $(this).toggle($(this).text().toLowerCase().includes(q));
    });
  });

  $("#addPostBtn").on("click", () => {
    let title = prompt("Enter post title:");
    let body = prompt("Enter post body:");
    if (title && body) {
      posts.push({ id: Date.now(), title, body });
      localStorage.setItem("posts", JSON.stringify(posts));
      refreshList();
      updateDashboard();
      toastr.success("Post added!");
    }
  });

  $("#postsList").on("click", ".editPost", function () {
    let id = $(this).parent().data("id");
    let post = posts.find((p) => p.id === id);
    let newTitle = prompt("Edit title:", post.title);
    let newBody = prompt("Edit body:", post.body);
    if (newTitle && newBody) {
      post.title = newTitle;
      post.body = newBody;
      localStorage.setItem("posts", JSON.stringify(posts));
      refreshList();
      toastr.info("Post updated!");
    }
  });

  $("#postsList").on("click", ".deletePost", function () {
    let id = $(this).parent().data("id");
    posts = posts.filter((p) => p.id !== id);
    localStorage.setItem("posts", JSON.stringify(posts));
    refreshList();
    updateDashboard();
    toastr.error("Post deleted!");
  });

  $("#postsList").on("click", "li", function (e) {
    if ($(e.target).is("button")) return;
    let postId = $(this).data("id");
    let related = comments.filter((c) => c.postId === postId);
    $("#commentsSection").html(
      related
        .map(
          (c) => `
        <div data-id="${c.id}">
          <b>${c.name}:</b> ${c.body}
          <button class="editComment">Edit</button>
          <button class="deleteComment">Delete</button>
        </div>
      `
        )
        .join("")
    );
  });

  $("#addCommentBtn").on("click", () => {
    let postId = $("#postsList li:first").data("id");
    let body = prompt("Enter comment:");
    if (body) {
      comments.push({ postId, id: Date.now(), name: "Local User", body });
      localStorage.setItem("comments", JSON.stringify(comments));
      updateDashboard();
      toastr.success("Comment added!");
    }
  });

  $("#commentsSection").on("click", ".editComment", function () {
    let id = $(this).parent().data("id");
    let comment = comments.find((c) => c.id === id);
    let newBody = prompt("Edit comment:", comment.body);
    if (newBody) {
      comment.body = newBody;
      localStorage.setItem("comments", JSON.stringify(comments));
      $("#commentsSection")
        .find(`[data-id='${id}']`)
        .find("b")
        .next()
        .text(newBody);
      toastr.info("Comment updated!");
    }
  });

  $("#commentsSection").on("click", ".deleteComment", function () {
    let id = $(this).parent().data("id");
    comments = comments.filter((c) => c.id !== id);
    localStorage.setItem("comments", JSON.stringify(comments));
    $(this).parent().remove();
    updateDashboard();
    toastr.error("Comment deleted!");
  });
}

function toggleMode() {
  $("body").toggleClass("dark");
  let mode = $("body").hasClass("dark") ? "dark" : "light";
  localStorage.setItem("theme", mode);
  toastr.info(
    mode === "dark" ? "Dark mode enabled 🌙" : "Light mode enabled ☀️"
  );
}

$(document).ready(function () {
  if (localStorage.getItem("theme") === "dark") $("body").addClass("dark");
  $("#toggleMode").on("click", toggleMode);
  if ($("#userCount").length) initData(updateDashboard);
  if ($("#usersTable").length)
    initData(() => {
      let users = JSON.parse(localStorage.getItem("users")) || [];
      loadUsersTable(users);
    });
  if ($("#postsList").length)
    initData(() => {
      let posts = JSON.parse(localStorage.getItem("posts")) || [];
      let comments = JSON.parse(localStorage.getItem("comments")) || [];
      renderPosts(posts, comments);
    });
});
