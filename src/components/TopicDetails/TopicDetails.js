import React from 'react';
import { connect } from 'dva';
import styles from './TopicDetails.css';
import { List, Avatar, Button, Spin } from 'antd';
import { API, URI } from '../../utils/api';

import reqwest from 'reqwest';

const fakeDataUrl = 'https://randomuser.me/api/?results=5&inc=name,gender,email,nat&noinfo';

class TopicDetails extends React.Component {
  state = {
    loading: true,
    loadingMore: false,
    showLoadingMore: true,
    data: [],
    detailsData: {},
    id:'',
    repliesData: [],
  }
  componentDidMount = () => {
    // this.getData((res) => {
    //   this.setState({
    //     loading: false,
    //     data: res.results,
    //   });
    // });

    console.log(this.props.topicDetails)
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
        console.log(response)
        this.setState({
          repliesData: response.data,
          loading: false,
        })
      })
    })
    API.get(`${URI.Topic.Topic}/${idValue}?include=user,category`).then((response) => {
      console.log(response)
      this.setState({
        detailsData: response,
      })
    })
  }
  getData = (callback) => {
    reqwest({
      url: fakeDataUrl,
      type: 'json',
      method: 'get',
      contentType: 'application/json',
      success: (res) => {
        callback(res);
      },
    });




  }
  onLoadMore = () => {
    this.setState({
      loadingMore: true,
    });


    this.getData((res) => {
      const data = this.state.data.concat(res.results);
      this.setState({
        data,
        loadingMore: false,
      }, () => {
        // Resetting window's offsetTop so as to display react-virtualized demo underfloor.
        // In real scene, you can using public method of react-virtualized:
        // https://stackoverflow.com/questions/46700726/how-to-use-public-method-updateposition-of-react-virtualized
        window.dispatchEvent(new Event('resize'));
      });
    });
  }
  render () {
    const { loading, loadingMore, showLoadingMore, data, repliesData } = this.state;
    const loadMore = showLoadingMore ? (
      <div style={{ textAlign: 'center', marginTop: 12, height: 32, lineHeight: '32px' }}>
        {loadingMore && <Spin />}
      </div>
    ) : null;
    return (
      <div>
        <h1 className={styles.title}>{this.state.detailsData.title}</h1>
        <p className={styles.content}>{this.state.detailsData.body}</p>
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
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    topicDetails: state.topicDetails,
  };
}

export default connect(mapStateToProps)(TopicDetails);
