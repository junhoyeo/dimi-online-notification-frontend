class AuthManager {
  constructor(application) {
    this.application = application;
    this.state = {
      username: '',
      password: '',
    };

    this.referenceUIElements();
    this.beforeInitialize();
    this.initializeEventHandlers();
  }

  setState(value) {
    const prevState = this.state;
    this.state = {
      ...prevState,
      ...value,
    };
  }

  _showElement(element) {
    element.style.display = 'flex';
  }

  _hideElement(element) {
    element.style.display = 'none';
  }

  _showLoginContainer() {
    this._hideElement(this.serviceContainer);
    this._showElement(this.loginContainer);
  }

  _showServiceContainer() {
    this._hideElement(this.loginContainer);
    this._showElement(this.serviceContainer);
  }

  async _getStudentInformation(token) {
    const { data } = await axios.get('https://dev-api.dimigo.in/user/jwt/', {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return data;
  }

  async _getStudentClassroom(token) {
    const { grade, klass, user_type } = await this._getStudentInformation(token);
    if (user_type !== 'S') {
      toast('디미고 학생만 사용할 수 있어요. 👅');
    }
    return `${grade}${klass}`;
  }

  _onChangeText(event, field) {
    const value = event.target.value;
    this.setState({ [field]: value });
  }

  _onKeydownUsername(event) {
    const isEnterPressed = event.keyCode === 13;
    if (isEnterPressed) {
      this.passwordInput.focus();
    }
  }

  _onKeydownPassword(event) {
    const isEnterPressed = event.keyCode === 13;
    if (isEnterPressed) {
      this._onClickLoginButton();
    }
  }

  async _onLogin(studentClassroom) {
    this._showServiceContainer();
    this.application.initializeService(studentClassroom);
  }

  async _onClickLoginButton() {
    const { username: id, password } = this.state;
    if (!id || !password) {
      toast('사용자 이름과 비밀번호를 모두 입력해 주세요! 😭');
      return;
    }
    try {
      const { data: { token } } = await axios.post('https://dev-api.dimigo.in/auth/', { id, password });
      const studentClassroom = await this._getStudentClassroom(token);
      setCookieForOneHour('token', token);
      this._onLogin(studentClassroom);
    } catch ({ response: { status } }) {
      if (status === 404) {
        toast(`사용자를 찾을 수 없어요.<br />
        입력한 정보를 확인해 주세요!! 👻`);
      } else {
        toast('헉, 오류가 발생했어요. 🥵');
      }
    }
  }

  referenceUIElements() {
    this.loginContainer = document.getElementById('login-container');
    this.serviceContainer = document.getElementById('service-container');

    this.usernameInput = document.getElementById('username-input');
    this.passwordInput = document.getElementById('password-input');
    this.loginButton = document.getElementById('login-button');
  }

  async beforeInitialize() {
    const token = getCookie('token');
    if (token) {
      this._showServiceContainer();
      const studentClassroom = await this._getStudentClassroom(token);
      this.application.initializeService(studentClassroom);
    } else {
      this._showLoginContainer();
    }
    if (this.application._isUnsupportedBroswer()) {
      return;
    }
  }

  initializeEventHandlers() {
    this.usernameInput.addEventListener(
      'change',
      (event) => this._onChangeText.apply(this, [event, 'username']),
    );

    this.usernameInput.addEventListener(
      'keyup',
      (event) => this._onKeydownUsername.apply(this, [event]),
    );

    this.passwordInput.addEventListener(
      'change',
      (event) => this._onChangeText.apply(this, [event, 'password']),
    );

    this.passwordInput.addEventListener(
      'keyup',
      (event) => this._onKeydownPassword.apply(this, [event]),
    );

    this.loginButton.addEventListener(
      'click',
      () => this._onClickLoginButton.apply(this),
    )
  }
}

const authManager = new AuthManager(application);
