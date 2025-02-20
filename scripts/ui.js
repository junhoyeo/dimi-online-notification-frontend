class ApplicationUI {
  constructor(authManager) {
    this.authManager = authManager;
    this.state = {
      isLoggedIn: false,
      currentClassroom: null,
      previousClassroom: null,
    };
    this.referenceUIElements();
  }

  setState(value) {
    const prevState = this.state;
    this.state = {
      ...prevState,
      ...value,
    };
  }

  _loadPreviousData(studentClassroom = null) {
    const previousClassroom =
      localStorage.getItem('previousClassroom') || studentClassroom;
    this.setState({
      currentClassroom: previousClassroom,
      previousClassroom,
    });
    return Boolean(previousClassroom);
  };

  _saveCurrentData(value) {
    localStorage.setItem('previousClassroom', value);
  }

  _isUnsupportedBroswer() {
    if (!firebase.messaging.isSupported()) {
      toast(`이 브라우저는 웹 알림을 지원하지 않아요! 😱<br />
        현재는 크롬과 파이어폭스 데스크탑 앱,<br />
        안드로이드 스마트폰만 지원하고 있어요.`, 6000);
      return true;
    }
    return false;
  }

  _recordUserInteraction(category, action, value) {
    const eventOptions = {
      hitType: 'event',
      eventCategory: category,
      eventAction: action,
    };

    if (value) {
      ga('send', {
        ...eventOptions,
        eventValue: Number(value),
      });
      return;
    }
    ga('send', eventOptions);
  }

  _onChangeSelector(event) {
    const value = event.target.value;
    this.setState({ currentClassroom: value });
  };

  _onClickButton() {
    this._recordUserInteraction('Subscribe', 'Click Subscribe button');
    if (this._isUnsupportedBroswer()) {
      this._recordUserInteraction('Subscribe', 'Fail to Subscribe due to unsupported broswer');
      return;
    }
    const { currentClassroom, previousClassroom } = this.state;

    if (!currentClassroom) {
      this._recordUserInteraction('Subscribe', 'Fail to Subscribe with no classroom selected');
      toast('잠깐! 먼저 알람을 받을 학급을 선택해 주세요! ✋');
      return;
    };
    if (currentClassroom === previousClassroom) {
      this._recordUserInteraction('Subscribe', 'Fail to Subscribe with no changes', currentClassroom);
      toast('이미 설정되어 있는 학급이예요! 👍');
      return;
    }

    this._changeButtonInnerText();
    this. _saveCurrentData(currentClassroom);
    this.setState({ previousClassroom: currentClassroom });
    try {
      notify(currentClassroom);
      this._recordUserInteraction('Subscribe', 'Success', currentClassroom);
    } catch (error) {
      console.log(error);
    }
  };

  _changeButtonInnerText() {
    this.button.innerText = '변경하기';
  }

  _addMultipleEventListener(eventTypes, element, listener) {
    eventTypes.forEach((eventType) => {
      element.addEventListener(eventType, listener);
    });
  }

  referenceUIElements() {
    this.selector = document.getElementById('selector');
    this.button = document.getElementById('subscribe-button');
  }

  initializeService(studentClassroom) {
    this.initializeSelectorOptions();
    this.initializeEventHandlers();

    if (this._loadPreviousData(studentClassroom)) {
      this._changeButtonInnerText();
    }
  }

  initializeSelectorOptions() {
    const generateOptionsForGrade = (grade) =>
      [1, 2, 3, 4, 5, 6].map((classNumber) => ({
        value: `${grade}${classNumber}`,
        text: `${grade}학년 ${classNumber}반`,
      }));
    const options = [
      ...generateOptionsForGrade(1),
      ...generateOptionsForGrade(2),
    ];

    options.forEach(({ value, text }) => {
      this.selector.insertAdjacentHTML('beforeend', `<option value="${value}">${text}</option>`);
    });

    const { previousClassroom } = this.state;
    if (previousClassroom) {
      const optionElements = [...this.selector.getElementsByTagName('option')];
      const previousOption = optionElements.find(({ value }) => value === previousClassroom);
      previousOption.selected = true;
    }
  }

  initializeEventHandlers() {
    this._addMultipleEventListener(
      ['change', 'blur'],
      this.selector,
      (event) => this._onChangeSelector.apply(this, [event]),
    );

    this.button.addEventListener(
      'click',
      () => this._onClickButton.apply(this),
    );
  }
}

const application = new ApplicationUI();
