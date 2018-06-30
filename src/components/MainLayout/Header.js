import React from 'react';
import { Menu } from 'antd';
import { Link } from 'dva/router';
import styles from './Header.css';
// import { API, URI } from '../../utils/api';
class Header extends React.Component {
  state = {
    list: [
      {
        title: '编程',
      },
      {
        title: '读书',
      },
      {
        title: '健身',
      },
      {
        title: '旅游',
      }
    ]
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
                  {item.title}
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
