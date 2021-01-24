import React from 'react'
import { Link } from 'react-router-dom'
const Sidebar = () => {
  return (
    <div>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Project List</Link>
            </li>
            <li>
              <Link to="/about">About!!!!</Link>
            </li>
            <li>
              <Link to="/users">Users</Link>
            </li>
          </ul>
        </nav>

        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
      </div>
    </div>
  )
}

export default Sidebar
