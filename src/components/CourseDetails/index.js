import {Component} from 'react'
import Loader from 'react-loader-spinner'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  inProgress: 'INPROGRESS',
  failure: 'FAILURE',
}

class Home extends Component {
  state = {coursesDetailsList: [], apiStatus: apiStatusConstants.initial}

  componentDidMount() {
    this.getCourseDetailsData()
  }

  getCourseDetailsData = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})

    const {match} = this.props
    const {params} = match
    const {id} = params

    const url = `https://apis.ccbp.in/te/courses/${id}`
    const options = {
      method: 'GET',
    }

    const response = await fetch(url, options)
    console.log(response)
    if (response.ok) {
      const data = await response.json()
      console.log(data)
      const fetchedData = {
        description: data.course_details.description,
        id: data.course_details.id,
        imgUrl: data.course_details.image_url,
        name: data.course_details.name,
      }
      this.setState({
        coursesDetailsList: fetchedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onClickRetry = () => {
    this.getCourseDetailsData()
  }

  renderLoaderContainer = () => (
    <div data-testid="loader" className="loader-container">
      <Loader type="ThreeDots" color="#4656a1" height={50} width={50} />
    </div>
  )

  renderCoursesContainer = () => {
    const {coursesDetailsList} = this.state
    const {imgUrl, name, description} = coursesDetailsList
    return (
      <div className="course-details-bg-container">
        <div className="course-details-container">
          <img src={imgUrl} alt={name} className="img" />
          <div className="course-details">
            <h1 className="course-details-name">{name}</h1>
            <p className="course-details-para">{description}</p>
          </div>
        </div>
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

  renderCourseDetailsApiStatus = () => {
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
    return this.renderCourseDetailsApiStatus()
  }
}

export default Home
