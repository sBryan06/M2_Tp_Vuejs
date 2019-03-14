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
        budget: 50
    },

    mounted() {
        this.courses = JSON.parse(localStorage.getItem('courses')) || []
    },
    methods: {
        addCourse () {
            if (this.form.course !== '') {
                const c = {
                    name: this.form.course,
                    coched: false,
                    price: 0
                }
                this.courses.push(c)

                this.form.course = ''
            }
        }
    },
    computed: {
        total: function () {
            return this.courses.reduce((acc, current) => current.coched ? acc += current.price : acc, 0)
        }
    },
    watch: {
        courses: {
            handler () {
                localStorage.setItem('courses', JSON.stringify(this.courses))
            },
            deep: true
        }
    },
})