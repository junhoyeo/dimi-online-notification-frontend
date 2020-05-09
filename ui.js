class ApplicationUI {
  constructor() {
    this.state = {
      currentClassroom: null,
    };
    this.referenceUIElements();
    this.initializeSelectorOptions();
    this.initializeEventHandlers();
  }

  setState(value) {
    const prevState = this.state;
    this.state = {
      ...prevState,
      ...value,
    };
  }

  _onChangeSelector(event) {
    const value = event.target.value;
    this.setState({ currentClassroom: value });
  };

  _onClickButton() {
    const { currentClassroom } = this.state;
    if (!currentClassroom) {
      alert('잠깐! 먼저 알람을 받을 학년과 반을 선택해 주세요! ✋');
      return;
    };
    notify(currentClassroom);
  };

  referenceUIElements() {
    this.selector = document.getElementById('selector');
    this.button = document.getElementById('button');
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
    })
  }

  initializeEventHandlers() {
    this.selector.addEventListener(
      'change',
      (event) => this._onChangeSelector.apply(this, [event]),
    );

    this.button.addEventListener(
      'click',
      () => this._onClickButton.apply(this),
    );
  }
}

const app = new ApplicationUI();
