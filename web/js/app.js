var MyCourses = {
    props: ['courses'],
    template: `
    <div>
        <div class="card" v-for="(course, index) in courses" :key="index">
            <div class="card-body" >
                <div class="row" >
                    <div class="col-1 align-center">
                        <input type="checkbox" v-model="course.coched"> </input>
                    </div>
                    <div class="col-3">
                        <label>{{ course.name }}</label>
                    </div>
                    <div class="col-5 align-center">
                        <div v-if="course.coched" class="input-group">
                            <input type="text" v-model.number="course.price">
                            <div class="input-group-append">
                                <span class="input-group-text">€</span>
                            </div>
                        </div>
                    </div>
                    <div class="col-3 align-center">
                        <el-button type="danger" icon="el-icon-delete" circle @click="removeItem(index)"></el-button>
                    </div>
                </div>
            </div>
        </div>
        
    </div>`,
    methods: {
        removeItem(index) {
            this.courses.splice(index, 1)
        }
    }
}

var MyAutocomplete = {
    props: ["courses", "suggestions", "search"],
    template: `<ul v-if="search.course" class="list-autocomplete">
        <li v-for="(suggestion, index) in filteredSuggestions" :key="index" @click="addCourses(suggestion.value)" class="autocomplete-row">
            {{suggestion.value}}
        </li>
    </ul>`,
    methods: {
        addCourses(item) {
            if (item !== '') {
                const c = {
                    name: item,
                    coched: false,
                    price: 0
                }
                this.courses.push(c)

                this.search.course = ''
            }
        },
        enrichSuggestions(name) {
            var found = this.suggestions.find(sugestion => sugestion.value.toLowerCase() === name.toLowerCase())
            console.log(found);
            if (!found) {
                this.suggestions.push({value: name})
            }
        },
    },
    computed: {
        filteredSuggestions() {
            return this.suggestions.filter(sugg => sugg.value.toLowerCase().includes(this.search.course.toLowerCase()))
        }
    }
}

var app = new Vue({
    el: '#app',

    components: {
        MyCourses,
        MyAutocomplete
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