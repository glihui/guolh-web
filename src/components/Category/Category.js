import React from 'react';
import { connect } from 'dva';
import styles from './Category.css';
import { List, Avatar, Icon, message } from 'antd';
import { API, URI } from '../../utils/api';


const IconText = ({ type, text, fun, isZan }) => (
  <span>
    <Icon type={type} style={{ marginRight: 8, color: isZan ? 'red': '' }} onClick={fun} />
    {text}
  </span>
);
class Category extends React.Component {
  state = {
    listData: []
  }
  componentDidMount() {
    API.get(`${URI.Topic.Topic}?include=user,category`).then((response) => {
      this.setState({
        listData: response.data,
      })
    })
  }
  goTopicDetails = (id) => {
    this.props.dispatch({
      type: 'route/redirect',
      payload: {
        Msg: {
          id
        },
      },
    });
    this.props.dispatch({
      type: 'topicDetails/saveId',
      payload: {
        Msg: {
          id
        },
      },
    });
  }
  // 点赞或取消点赞
  goZan = (id,index,flag,e) => {
    e.stopPropagation();
    if (this.props.Auth.User.id) {
      if (flag == 1) {
        API.delete(`${URI.Topic.Topic}/${id}/zans`,
          {},
          {Authorization: `Bearer ${this.props.Auth.User.meta.access_token}`})
          .then((response) => {
            console.log(response);

            if (response.ok == '1') {
              let tmpData = {};
              tmpData.data = this.props.topicList.data.data;
              console.log(tmpData);
              tmpData.data[index].is_zan = 0;
              tmpData.data[index].zan_count = parseInt(tmpData.data[index].zan_count) - 1;
              localStorage.setItem('categoriesList', JSON.stringify(tmpData));
              this.props.dispatch({
                type: 'topicList/saveData',
                payload: {
                  data: tmpData,
                }
              })
            } else {
              message.error(response.msg);
            }


          })
      } else {
        API.post(`${URI.Topic.Topic}/${id}/zans`,
          {},
          {Authorization: `Bearer ${this.props.Auth.User.meta.access_token}`})
          .then((response) => {
            console.log(response);

            if (response.ok == '1') {
              let tmpData = {};
              tmpData.data = this.props.topicList.data.data;
              console.log(tmpData);
              tmpData.data[index].is_zan = 1;
              tmpData.data[index].zan_count = parseInt(tmpData.data[index].zan_count) + 1;
              localStorage.setItem('categoriesList', JSON.stringify(tmpData));
              this.props.dispatch({
                type: 'topicList/saveData',
                payload: {
                  data: tmpData,
                }
              })
            } else {
              message.error(response.msg);
            }


          })
      }
    } else {
      message.error('登录后才能点赞');
      return false;
    }

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
          dataSource={this.props.topicList.data.data}
          renderItem={(item, index) => (
            <List.Item
              key={item.title}
              actions={[<IconText isZan={item.is_zan} fun={this.goZan.bind(null, item.id, index, item.is_zan)} type="like-o" text={item.zan_count} />, <IconText type="message" text={item.reply_count} />]}
              extra={<img width={272} alt="logo" src={item.img} />}
              onClick={this.goTopicDetails.bind(null,item.id)}
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
    Auth: state.Auth,
    route: state.route,
    topicList: state.topicList,
  };
}

export default connect(mapStateToProps)(Category);
