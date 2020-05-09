class ApplicationUI {
  constructor() {
    this.state = {
      currentClassroom: null,
      previousClassroom: null,
    };
    this.referenceUIElements();
    this.beforeInitialize();
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

  _loadPreviousData = () => {
    const previousClassroom = localStorage.getItem('previousClassroom') || null;
    this.setState({
      currentClassroom: previousClassroom,
      previousClassroom,
    });
    return Boolean(previousClassroom);
  };

  _saveCurrentData = (value) => {
    localStorage.setItem('previousClassroom', value);
  }

  _onChangeSelector(event) {
    const value = event.target.value;
    this.setState({ currentClassroom: value });
  };

  _onClickButton() {
    const { currentClassroom, previousClassroom } = this.state;
    if (!currentClassroom) {
      toast('잠깐! 먼저 알람을 받을 학급을 선택해 주세요! ✋');
      return;
    };
    if (currentClassroom === previousClassroom) {
      toast('이미 설정되어 있는 학급이예요! 👍');
      return;
    }

    this._changeButtonInnerText();
    this. _saveCurrentData(currentClassroom);
    this.setState({ previousClassroom: currentClassroom });
    notify(currentClassroom);
  };

  _changeButtonInnerText() {
    this.button.innerText = '변경하기';
  }

  referenceUIElements() {
    this.selector = document.getElementById('selector');
    this.button = document.getElementById('button');
  }

  beforeInitialize() {
    if (this._loadPreviousData()) {
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
