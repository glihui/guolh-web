import React from 'react';
import { connect } from 'dva';
import styles from './Header.css';
import { API, URI } from '../../utils/api';
import { Modal, Button, Input, Icon, message } from 'antd';
class Header extends React.Component {
  state = {
    list: [],
    visible: false,
    userName: '',
    password: '',
    status:'0',
    tabId: '',
  }
  componentDidMount = () => {

    // 获取个人信息
    const usermsg = localStorage.getItem('user') && JSON.parse(localStorage.getItem('user'));
    if (usermsg && usermsg.id) {
      this.props.dispatch({
        type: 'Auth/load',
        payload: {
          token: usermsg.meta.access_token,
        }
      })
    }
    const categories = localStorage.getItem('categories');
    const categoryId = localStorage.getItem('categoryId');
    if (!categoryId) {
      this.setState({
        tabId: 1,
      })
      setTimeout(() => {
        this.selectNav(1)
      }, 500);

    } else {
      this.setState({
        tabId: categoryId,
      });
      if (this.props.topicList.data.meta) {

      } else {
        setTimeout(() => {
          this.selectNav(categoryId)
        }, 500);

      }
    }
    if (!categories) {
      API.get(URI.Topic.Category).then((response) => {
        this.setState({
          list: response.data,
        }, () => {
          localStorage.setItem('categories', JSON.stringify(response.data));
        })
      })
    } else {
      this.setState({
        list: JSON.parse(categories),
      })
    }

  }
  showModal = (status) => {
    this.setState({
      visible: true,
      status,
    });
  }

  handleOk = (e) => {
    if (this.state.userName == '' || this.state.password == '') {
      message.error('用户名或密码不能为空');
      return false;
    }
    let sendJson = {
      name: this.state.userName,
      password: this.state.password,
    }
    let url = '';
    let tmpMsg = '';
    if (this.state.status == 0) {
      url = URI.Auth.Register;
      tmpMsg = '注册成功';
    } else if (this.state.status == 1) {
      url = URI.Auth.Login;
      tmpMsg = '登录成功';
    }
    API.post(url, sendJson).then((response) => {
        this.setState({
          visible: false,
        });
        if (response.id) {
          message.success(tmpMsg);
          this.props.dispatch({
            type: 'Auth/saveUser',
            payload: {
              User: response,
            }
          })
          localStorage.setItem('user', JSON.stringify(response));


          const categoryId = localStorage.getItem('categoryId');
          if (!categoryId) {
            this.setState({
              tabId: 1,
            })
            setTimeout(() => {
              this.selectNav(1)
            }, 500);

          } else {
            this.setState({
              tabId: categoryId,
            });
            setTimeout(() => {
              this.selectNav(categoryId)
            }, 500);
          }

        } else {
          if (response.errors) {
            message.error(response.errors.password[0]);
          } else {
            message.error(response.message);
          }
        }
    })
  }

  handleCancel = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  }

  emitEmptyUser = () => {
    this.userNameInput.focus();
    this.setState({ userName: '' });
  }

  emitEmptyPwd = () => {
    this.passwordInput.focus();
    this.setState({ password: '' });
  }

  onChangeUserName = (e) => {
    this.setState({ userName: e.target.value });
  }
  onChangePassword = (e) => {
    this.setState({ password: e.target.value });
  }
  logout = () => {
    message.success('成功退出');
    this.props.dispatch({
      type: 'Auth/saveUser',
      payload: {
        User: {},
      }
    })
    localStorage.setItem('user', JSON.stringify({}));

    const categoryId = localStorage.getItem('categoryId');
    if (!categoryId) {
      this.setState({
        tabId: 1,
      })
      setTimeout(() => {
        this.selectNav(1)
      }, 500);

    } else {
      this.setState({
        tabId: categoryId,
      });
      setTimeout(() => {
        this.selectNav(categoryId)
      }, 500);
    }
  }
  selectNav = (id) => {
    this.setState({
      tabId: id,
    });
    localStorage.setItem('categoryId', id);

    let tmpJSon = {};
    if (this.props.Auth.User.meta) {
      tmpJSon = {Authorization: `Bearer ${this.props.Auth.User.meta.access_token}`}
    }
    API.get(`${URI.Topic.Category}/${id}`,{},tmpJSon).then((response) => {
      localStorage.setItem('categoriesList', response);
      this.props.dispatch({
        type: 'topicList/saveData',
        payload: {
          data: response,
        }
      })
    });
    this.props.dispatch({
      type: 'route/redirectIndex',
      payload: {
        Msg: {

        },
      },
    });
  }
  render () {
    const { userName, password } = this.state;
    const userSuffix = userName ? <Icon type="close-circle" onClick={this.emitEmptyUser} /> : null;
    const pwdSuffix = password ? <Icon type="close-circle" onClick={this.emitEmptyPwd} /> : null;
    return (
      <div className={styles.top}>
        <div className={`${styles.topNav} ${styles.topNavLeft}`}>
          love and dreams
        </div>
        <ul className={`${styles.topNav} ${styles.topNavRight}`}>
          {
            this.state.list.map((item, index) => {
              return (
                <li key={index} className={this.state.tabId == item.id? styles.tabActive : ''} onClick={this.selectNav.bind(null, item.id)}>
                  {item.name}
                </li>
              )
            })
          }
        </ul>
        <div style={{ display: this.props.Auth.User.id ? '' : 'none'}} className={styles.userAvatar}>
          <img src={this.props.Auth.User.avatar}/>
          <span className={styles.userSpan}>{this.props.Auth.User.name}</span>
          <span className={styles.logoutBtn} onClick={this.logout}>退出</span>
        </div>
        <Button style={{ display: this.props.Auth.User.id ? 'none' : ''}} className={styles.loginBtn} type="primary" onClick={this.showModal.bind(null,'0')}>注册</Button>
        <Button style={{ display: this.props.Auth.User.id ? 'none' : ''}} className={styles.loginBtn} type="primary" onClick={this.showModal.bind(null,'1')}>登录</Button>
        <Modal
          title={this.state.status == '0' ? '注册' : '登录'}
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          cancelText="取消"
          okText="确认"
        >
          <Input
            placeholder="输入您的账号"
            prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
            suffix={userSuffix}
            value={userName}
            onChange={this.onChangeUserName}
            ref={node => this.userNameInput = node}
          />
          <Input
            type='password'
            placeholder="输入您的密码"
            prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
            suffix={pwdSuffix}
            value={password}
            onChange={this.onChangePassword}
            ref={node => this.passwordInput = node}
            className={styles.loginInput}
          />
        </Modal>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    Auth: state.Auth,
    topicList: state.topicList,
    route: state.route,
  }
}

export default connect(mapStateToProps)(Header);
