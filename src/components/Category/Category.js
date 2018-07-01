import React from 'react';
import { connect } from 'dva';
import styles from './Category.css';
import { List, Avatar, Icon } from 'antd';
import { API, URI } from '../../utils/api';


const IconText = ({ type, text }) => (
  <span>
    <Icon type={type} style={{ marginRight: 8 }} />
    {text}
  </span>
);
class Category extends React.Component {
  state = {
    listData: []
  }
  componentDidMount() {
    API.get(`${URI.Topic.Topic}?include=user,category`).then((response) => {
      console.log(response)
      this.setState({
        listData: response.data,
      })
    })
  }
  render () {
    return (
      <div className={styles.content}>
        <List
          itemLayout="vertical"
          size="large"
          pagination={{
            onChange: (page) => {
              console.log(page);
            },
            pageSize: 5,
          }}
          dataSource={this.state.listData}
          renderItem={item => (
            <List.Item
              key={item.title}
              actions={[<IconText type="star-o" text="0" />, <IconText type="like-o" text="0" />, <IconText type="message" text={item.reply_count} />]}
              extra={<img width={272} alt="logo" src={item.img} />}
            >
              <List.Item.Meta
                avatar={<Avatar src={item.avatar} />}
                title={<a href={item.href}>{item.title}</a>}
                description={item.body}
              />
              {item.content}
            </List.Item>
          )}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
  };
}

export default connect(mapStateToProps)(Category);
