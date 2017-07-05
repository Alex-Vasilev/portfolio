<template>
    <div class="blog-content contact">
        <h3>Contact</h3>
        <form @submit.prevent="onContactSubmit" class="container">
            <p class="contact-form-description">Say hello etc.</p>
            <div class="form-group">              
                <input class="contact-email"
                       name="email"
                       v-model="from"
                       placeholder="E-mail"/>
                <p v-show="from && !isEmailValid">Sasai</p>
            </div>
            <div class="form-group">              
                <textarea class="contact-message"
                          name="message" 
                          v-model="message"
                          placeholder="Message"
                          rows="4"></textarea>
                <p v-show="message && !isMessageValid">Or vishe gor</p>
            </div>
            <div class="panel-body">
                <button type="submit"
                        class="btn btn-sm btn-primary"
                        v-bind:disabled="fullInputs">Send</button>
            </div>
        </form>
        <transition name="component-fade" mode="out-in">
            <div v-if="success_message"
                 class="success_message">Cool that you decided to write to me! Wait for reply in the near future</div>
        </transition>
        <div>
            <p class="email">aleksandr_vasilev1989@list.ru</p>
            <a class="phone" href="tel:+375445754785"> +375(44) 575 47 85 </a>
            <p class="city">Minsk</p>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'Contact',
        data: function () {
            return {
                success_message: false,
                from: '',
                message: '',
                fullInputs: true
            };
        },
        methods: {
            onContactSubmit: function () {
                var self = this;
                $.ajax({
                    url: "api/contact",
                    type: "POST",
                    contentType: "application/json",
                    data: JSON.stringify({
                        from: this.from,
                        message: this.message
                    }),
                    success: function () {
                        self.from = '';
                        self.message = '';
                        console.log('send');
                        self.success_message = true;
                        setTimeout(function () {
                            self.success_message = false;
                        }, 3000);
                    },
                    error: function () {
                        console.log('ebanarot');
                    }
                });
            }
        },

        computed: {
            isEmailValid() {
                return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(this.from);
            },

            isMessageValid() {
                if (this.message.length > 3)
                    return  true;
                else
                    return false;
            }
        }
    }
</script>