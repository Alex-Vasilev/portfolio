<template>
    <div class="blog-content about">
        <div class="container"> 
                <h3>About</h3>
                <p> Hello! My name is Alex.
                    I'm a Front-end developer and i like building beautiful and usable interfaces.
                    I've experiences building responsive and cross-browser web sites with a different 
                    stacks both with the use of a native js, and with the use of frameworks (jQuery, Vue, Angular 2-4 etc)
                    Now we are working with the guys to develop a cool callback widget
                    with CRM and analytics. Here I will keep a small blog, in which I
                    will describe interesting things that I will encounter in the process of work.
                    This site was made as a whole as an exercise. On the frontend I used Vue 2.x, 
                    the assembly is webpack, on the backend - nodeJS. As a database, I tried mongo. 
                    In the first articles, I'll briefly describe the process of creating a site with
                    a similar stack and what interesting things you'll have to meet if you want to do 
                    something like that.
                    I do not apply for the last instance and this information will be of a fact-finding character.
                    Therefore, here are my contacts and if you have an irresistible desire to discuss these
                    topics - write here or in the comments, I will be happy.</p>
            </div>
        </div>
</template>

<script>
export default {
    name: 'About',      
    created(){
        ga('send', 'pageview', 'about');
    }   
}
</script>
