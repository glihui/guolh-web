import React from 'react';
import { connect } from 'dva';
import styles from './TopicDetails.css';
import { List, Avatar, Button, Spin, Tag, Modal, Input, message } from 'antd';
import { API, URI } from '../../utils/api';

const { TextArea } = Input;

class TopicDetails extends React.Component {
  state = {
    loading: true,
    loadingMore: false,
    showLoadingMore: true,
    data: [],
    detailsData: {},
    id:'',
    repliesData: [],
    loadingComment: false,
    visible: false,
    commentContent: '',
  }
  componentDidMount = () => {
    if (this.props.topicDetails.Msg.id) {
      localStorage.setItem('topicId', this.props.topicDetails.Msg.id);
    }

    this.getTopicDetails(this.props.topicDetails.Msg.id)
  }
  getTopicDetails = (id) => {
    let idValue = id;
    if (idValue) {

    } else {
      idValue = localStorage.getItem('topicId');
    }
    this.setState({
      id: idValue,
    }, () => {
      API.get(`${URI.Topic.Topic}/${this.state.id}/replies?include=user`).then((response) => {
        this.setState({
          repliesData: response.data,
          loading: false,
        })
      })
    })
    API.get(`${URI.Topic.Topic}/${idValue}?include=user,category`).then((response) => {
      this.setState({
        detailsData: response,
      })
    })
  }

  handleOk = () => {
    console.log(this.props.Auth.User)
    if (this.state.commentContent != '') {
      this.setState({ loadingComment: true });

      API.post(`${URI.Topic.Topic}/${this.state.id}/replies`,
        {content: this.state.commentContent},
        {Authorization: `Bearer ${this.props.Auth.User.meta.access_token}`})
        .then((response) => {
        console.log(response);
        this.setState({ loadingComment: false, visible: false });

        API.get(`${URI.Topic.Topic}/${this.state.id}/replies?include=user`).then((response) => {
          this.setState({
            repliesData: response.data,
          })
        })
      })
    } else {
      message.error('评论内容不能为空');
    }


  }

  handleCancel = () => {
    this.setState({ visible: false });
  }
  buildInputField = (fieldName) => {
    return {
      value: this.state[fieldName],
      onChange: (e) => {
        this.setState({ [fieldName]: e.target.value });
      }
    }
  }
  comment = () => {
    if (this.props.Auth.User.id) {

    } else {
      message.error('登录后才能评论');
      return false;
    }
    this.setState({
      visible: true,
    });
  }
  render () {
    const { loading, loadingMore, showLoadingMore, data, repliesData, loadingComment, visible } = this.state;
    const loadMore = showLoadingMore ? (
      <div style={{ textAlign: 'center', marginTop: 12, height: 32, lineHeight: '32px' }}>
        {loadingMore && <Spin />}
      </div>
    ) : null;
    return (
      <div>
        <h1 className={styles.title}>{this.state.detailsData.title}</h1>
        <p className={styles.content}>{this.state.detailsData.body}</p>
        <Tag color="#2db7f5" onClick={this.comment}>评论</Tag>
        <List
          className="demo-loadmore-list"
          loading={loading}
          itemLayout="horizontal"
          loadMore={loadMore}
          dataSource={repliesData}
          renderItem={item => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar src={item.user.avatar} />}
                title={<a href="https://ant.design">{item.user.name}</a>}
                description={item.content}
              />
            </List.Item>
          )}
        />
        <Modal
          visible={visible}
          title="评论"
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={[
            <Button key="back" onClick={this.handleCancel}>取消</Button>,
            <Button key="submit" type="primary" loading={loadingComment} onClick={this.handleOk}>
              提交
            </Button>,
          ]}
        >
          <TextArea rows={4} {...this.buildInputField('commentContent')}/>
        </Modal>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    topicDetails: state.topicDetails,
    Auth: state.Auth,
  };
}

export default connect(mapStateToProps)(TopicDetails);
