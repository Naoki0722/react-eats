import { Link } from "react-router-dom"

export const Home = () => {
  return (
    <>
    <h2>Homeがめん</h2>
    <p>adfs</p>
    <ul>
      <li>
        <Link to="/">Home</Link>
      </li>
      <li>
        <Link to="/restaurants">Restaurant</Link>
      </li>
    </ul>
    </>
  )
}
