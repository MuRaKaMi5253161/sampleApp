// autobind decorator
// 引数に_を指定すると必ず関数内で使用しないことを宣言する。
function autobind(_: any,_2: string, descriptor: PropertyDescriptor,) {
    const originalMethod = descriptor.value;
    const adjDescriptor: PropertyDescriptor = {
        configurable: true,
        get() {
            const boundFn = originalMethod.bind(this);
            return boundFn;
        }
    }
    return adjDescriptor;
}

class ProjectInput {
    templateElement: HTMLTemplateElement;
    hostElement: HTMLDivElement;
    element: HTMLFormElement;
    titleInputElement: HTMLInputElement;
    descriptionInputElement: HTMLInputElement;
    mandayInputElement: HTMLInputElement;

    constructor() {
        // asはnullではないことを保証
        this.templateElement = document.getElementById('project-input')! as HTMLTemplateElement;
        this.hostElement = document.getElementById('app')! as HTMLDivElement;

        // importNode(templateタグの内側を指定, ディープクローンするかどうか true:する, false:しない)
        const importedNode = document.importNode(this.templateElement.content,true);
        // formの値を取得する
        this.element = importedNode.firstElementChild as HTMLFormElement;
        this.element.id = 'user-input';
         
        // formの入力値を格納する
        this.titleInputElement = this.element.querySelector('#title') as HTMLInputElement;
        this.descriptionInputElement = this.element.querySelector('#description') as HTMLInputElement;
        this.mandayInputElement = this.element.querySelector('#manday') as HTMLInputElement;

        this.configure();
        this.attach();
    }

    // void 返却値の型が守れない場合もあるよという意味 return;の部分
    private getherUserInput(): [string, string, number] | void {
        const enterdTitle = this.titleInputElement.value;
        const enterdDescription = this.descriptionInputElement.value;
        const enterdManday = this.mandayInputElement.value;

        if(
            enterdTitle.trim().length === 0 ||
            enterdDescription.trim().length === 0 ||
            enterdManday.trim().length === 0
        ) {
            alert("未入力の項目があります");
            return;
        } else {
            return [enterdTitle, enterdDescription, +enterdManday];
        }
    }

    private clearInputs() {
        this.titleInputElement.value = "";
        this.descriptionInputElement.value = "";
        this.mandayInputElement.value = "";
    }

    @autobind
    private submitHandler(event: Event) {
        event.preventDefault();
        console.log(this.titleInputElement.value);
        const userInput = this.getherUserInput();
        if(Array.isArray(userInput)) {
            const[title, desc, manday] = userInput;
            console.log(title,desc,manday);
            this.clearInputs();
        }
    }

    private configure() {
        this.element.addEventListener('submit', this.submitHandler.bind(this));
    }

    // hostElementに要素を追加する
    private attach() {
        this.hostElement.insertAdjacentElement('afterbegin', this.element);
    }
}

const prjInput = new ProjectInput();