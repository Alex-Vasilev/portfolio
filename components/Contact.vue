<template>
    <div class="blog-content">
        <div class="container">
            <div class="inner-container">
                <h3>Contact</h3>
                <transition name="component-fade"
                            mode="out-in">
                    <div v-if="success_message"
                         class="info-message">
                        Cool that you decided to write to me! Wait for reply in the near future
                    </div>
                </transition>
                <transition name="component-fade"
                            mode="out-in">
                    <div v-if="error_message"
                         class="info-message">
                        Something went wrong. Check your internet connection
                    </div>
                </transition>
                <div class="contact-page-body">
                    <form @submit.prevent="onContactSubmit"
                           class='contact-form'>
                        <p class="contact-form-description">say hello etc.</p>
                        <div class="form-group">              
                            <input class="contact-email"
                                   name="email"
                                   v-model="from"
                                   placeholder="E-mail"/>
                            <p class="invalid-contact-data"
                               v-show="from && !isEmailValid">Not correct e-mail</p>
                        </div>
                        <div class="form-group">              
                            <textarea class="contact-message"
                                      name="message" 
                                      v-model="message"
                                      placeholder="Message"
                                      rows="4"></textarea>
                            <p class="invalid-contact-data"
                                v-show="message && !isMessageValid">
                                Message must be more than 5 symbols e.g. 'Hello!'
                            </p>
                        </div>
                        <div class="panel-body">
                            <button type="submit"
                                    class="btn btn-sm btn-primary"
                                    :disabled="!message || !isMessageValid || !from || !isEmailValid">Send</button>
                        </div>
                    </form>
                    <div class="contact-current">
                        <p class="email">
                            <i class="fa fa-envelope" aria-hidden="true"></i>
                            aleksandr_vasilev1989@list.ru
                        </p>
                        <a class="phone" href="tel:+375445754785">
                            <i class="fa fa-phone" aria-hidden="true"></i>
                            +375(44) 575 47 85
                        </a>
                        <p class="city">
                            <i class="fa fa-map-marker" aria-hidden="true"></i>
                            Minsk, Belarus
                        </p>
                    </div>         
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'Contact',
        data: function () {
            return {
                success_message: false,
                error_message: false,
                from: '',
                message: '',
                fullInputs: true
            };
        },
      
        methods: {
            onContactSubmit: function () {
                let self = this;
                let data = JSON.stringify({
                    from: this.from,
                    message: this.message
                });
                                    self.error_message = true;

//                this.$http.post('api/contact', data, {
//                    headers: {"contentType": "application/json"}
//                }).then(response => {
//                    self.from = '';
//                    self.message = '';
//                    console.log('send');
//                    self.success_message = true;
//                    setTimeout(function () {
//                        self.success_message = false;
//                    }, 3000);
//                }, response => {
//                    console.log('fail');
//                    self.error_message = true;
//                    setTimeout(function () {
//                        self.error_message = false;
//                    }, 3000);
//                });
            }
        },

        computed: {
            isEmailValid() {
                return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(this.from);
            },

            isMessageValid() {
                if (this.message.length > 5)
                    return  true;
                else
                    return false;
            }
        }
    }
</script>