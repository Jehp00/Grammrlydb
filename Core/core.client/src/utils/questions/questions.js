

export class Question {
    constructor() {
        this.questions = [];
    }

    async fetchQuestions() {
        try {
            const response = await fetch('/Questions.json');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            this.questions = await response.json();
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }
    }

    getQuestions() {
        return this.questions;
    }
}
