import React from 'react';
import { connect } from 'dva';
import styles from './IndexPage.css';

class IndexPage extends React.Component {
  state = {
    tabList: [
      {title: '编程'},
      {title: '读书'},
      {title: '健身'},
      {title: '旅行'},
    ]
  }
  render () {
    return (
      <div className={styles.header_nav}>
        <div className={styles.my_name}>
          郭黎辉的官方网站
        </div>
        <div>
          <ul className={styles.tab_ul}>
            {
              this.state.tabList.map((item, index) => {
                return (
                  <li key={index} className={styles.tab_li}>
                    <a>{item.title}</a>
                  </li>
                )
              })
            }
          </ul>
        </div>
      </div>
    )
  }
}

IndexPage.propTypes = {
};

export default connect()(IndexPage);
