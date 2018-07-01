import React from 'react';
import styles from './Header.css';
import { API, URI } from '../../utils/api';
class Header extends React.Component {
  state = {
    list: []
  }
  componentDidMount = () => {
    API.get(URI.Topic.Category).then((response) => {
      console.log(response)
      this.setState({
        list: response.data,
      })
    })
  }
  render () {
    return (
      <div className={styles.top}>
        <div className={`${styles.topNav} ${styles.topNavLeft}`}>
          郭黎辉的官方网站
        </div>
        <ul className={`${styles.topNav} ${styles.topNavRight}`}>
          {
            this.state.list.map((item, index) => {
              return (
                <li key={index}>
                  {item.name}
                </li>
              )
            })
          }
        </ul>
      </div>
    )
  }
}

export default Header;
