var MyCourses = {
    props: ['courses'],
    template: `
    <div>
        <div class="row" v-for="(course, index) in courses" :key="index">
            <div class="col-1 align-center">
                <input type="checkbox" v-model="course.coched"> </input>
            </div>
            <div class="col-2">
                <label>{{ course.name }}</label>
            </div>
            <div class="col-3 align-center">
                <div v-if="course.coched" class="input-group">
                    <input type="texr" v-model.number="course.price">
                    <div class="input-group-append">
                        <span class="input-group-text">€</span>
                    </div>
                </div>
            </div>
            <div>
                <button type="button" class="btn btn-danger" @click="removeItem(index)"> Delete </button>
            </div>
            
        </div>
    </div>`,
    methods: {
        removeItem(index) {
            this.courses.splice(index, 1)
        }
    }
}

var app = new Vue({
    el: '#app',

    components: {
        MyCourses
    },
    data: {
        courses: [],
        form: {
            course: ''
        },
        budget: 50,
        suggestions: [{value: 'choco'}, {value: 'banane'}, {value: 'patate'}, {value: 'poulet'}, {value: 'riz'}]
    },

    mounted() {
        this.courses = JSON.parse(localStorage.getItem('courses')) || []
    },
    methods: {
        addCourse() {
            if (this.form.course !== '') {
                const c = {
                    name: this.form.course,
                    coched: false,
                    price: 0
                }
                this.courses.push(c)

                this.enrichSuggestions(this.form.course)

                this.form.course = ''
            }
        },

        enrichSuggestions(name) {
            var found = this.suggestions.find(sugestion => sugestion.value.toLowerCase() === name.toLowerCase())
            console.log(found);
            if (!found) {
                this.suggestions.push({value: name})
            }
        },
        handleSelect(item) {
            this.addCourse()
        },
        querySearch(queryString, cb) {
            var courses = this.suggestions;
            var results = queryString ? courses.filter(this.createFilter(queryString)) : courses;
            // call callback function to return suggestions
            console.log(results);
            cb(results);
        },
        createFilter(queryString) {
            return (course) => {
                return (course.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
            };
        }
    },
    computed: {
        total: function () {
            return this.courses.reduce((acc, current) => current.coched ? acc += current.price : acc, 0)
        }
    },
    watch: {
        courses: {
            handler() {
                localStorage.setItem('courses', JSON.stringify(this.courses))
            },
            deep: true
        }
    },
})