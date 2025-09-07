# Simple_FrontEnd_Dashboard

Mini Dashboard Project

Overview:
This is a small dashboard project built with HTML, CSS, Animate.css, JavaScript, jQuery, DataTables, Toastr, and JSONPlaceholder API. 
The project fetches data from APIs, displays it in tables and lists, and allows Create, Read, Update, and Delete (CRUD) operations. 
Changes are saved in LocalStorage and the interface updates in real time with notifications for every action.

Features:

Dashboard
- Shows live counts of Users, Posts, and Comments.
- Numbers update automatically when data changes.

Users Page
- Loads users from JSONPlaceholder Users API.
- DataTable with add, edit, delete, and favorite functionality.
- Favorites are saved in LocalStorage.
- Notifications for every action.

Posts Page
- Loads posts from JSONPlaceholder Posts API.
- Live search for posts.
- Add, edit, delete posts locally.
- Shows related comments from JSONPlaceholder Comments API.
- Add, edit, delete comments locally.
- Notifications for all actions.

Favorites
- Users can be marked or unmarked as favorites.
- Favorites are saved in LocalStorage with notifications.

Theme Toggle
- Light and Dark mode toggle.
- Preference saved in LocalStorage.
- Notification shows current mode.

Notifications
- Toastr notifications for all actions:
  * Adding, editing, deleting users
  * Adding, editing, deleting posts
  * Adding, editing, deleting comments
  * Adding or removing favorites
  * Toggling theme

Loader
- Displays a loading screen while fetching API data.

Tech Stack:
- HTML5
- CSS3
- Animate.css
- jQuery
- DataTables.js
- Toastr.js
- JSONPlaceholder API
- LocalStorage

How to Run:
1. Download or clone the project.
2. Open index.html in a browser.
3. Navigate to Users or Posts pages.
4. Add, edit, or delete users, posts, and comments.
5. Toggle between light and dark mode.
6. Notifications appear for all actions.

File Structure:
/project-root
  index.html        - Dashboard
  users.html        - Users DataTable
  posts.html        - Posts and Comments
  css/style.css     - Styles
  js/main.js        - Main logic
  README.txt        - Project documentation
