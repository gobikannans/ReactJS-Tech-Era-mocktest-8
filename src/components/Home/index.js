import {Component} from 'react'
import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  inProgress: 'INPROGRESS',
  failure: 'FAILURE',
}

class Home extends Component {
  state = {coursesList: [], apiStatus: apiStatusConstants.initial}

  componentDidMount() {
    this.getCourseData()
  }

  getCourseData = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})

    const url = 'https://apis.ccbp.in/te/courses'
    const options = {
      method: 'GET',
    }

    const response = await fetch(url, options)
    console.log(response)
    if (response.ok) {
      const data = await response.json()
      console.log(data)
      const fetchedData = data.courses.map(eachItem => ({
        id: eachItem.id,
        logoUrl: eachItem.logo_url,
        name: eachItem.name,
      }))
      this.setState({
        coursesList: fetchedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onClickRetry = () => {
    this.getCourseData()
  }

  renderLoaderContainer = () => (
    <div data-testid="loader" className="loader-container">
      <Loader type="ThreeDots" color="#4656a1" height={50} width={50} />
    </div>
  )

  renderCoursesContainer = () => {
    const {coursesList} = this.state
    return (
      <div className="course-container">
        <h1 className="main-heading">Courses</h1>
        <ul className="course-list-container">
          {coursesList.map(eachItem => (
            <Link
              to={`/courses/${eachItem.id}`}
              className="nav-links"
              key={eachItem.id}
            >
              <li className="course-list-item">
                <img
                  src={eachItem.logoUrl}
                  alt={eachItem.name}
                  className="course-img"
                />
                <p className="course-name">{eachItem.name}</p>
              </li>
            </Link>
          ))}
        </ul>
      </div>
    )
  }

  renderFailureContainer = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/tech-era/failure-img.png"
        alt="failure view"
        className="failure-img"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-para">
        We cannot seem to find the page you are looking for.
      </p>
      <button type="button" className="failure-btn" onClick={this.onClickRetry}>
        Retry
      </button>
    </div>
  )

  renderHomeApiStatus = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderCoursesContainer()
      case apiStatusConstants.inProgress:
        return this.renderLoaderContainer()
      case apiStatusConstants.failure:
        return this.renderFailureContainer()
      default:
        return null
    }
  }

  render() {
    return this.renderHomeApiStatus()
  }
}

export default Home
