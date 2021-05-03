<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <p>
    Accelerator is a product that makes it easy to access your business data from anywhere!
    </p>
    <p>
      
      Links
      </p>
    <p>
      <br />
      <router-link to="fileemail">fileemail</router-link>
<br />
      <router-link to="history">history</router-link>
      <br />
      <router-link to="attachdocuments">attachdocuments</router-link>
      <br />
      <router-link to="emailtemplates">emailtemplates</router-link>
      <br />
      <router-link to="task">task</router-link>
      <br />
      <router-link to="logcall">logcall</router-link>
      <br />
      <router-link to="addressbook">addressbook</router-link>
      <br />
      <router-link to="mytaskpane">mytaskpane</router-link>
            <br />
      <router-link to="parseemail">parseemail</router-link>
              <br />
      <router-link to="about">about</router-link>
         <br />
      <router-link to="startup">startup</router-link>
      
         <router-view/>
      </p>
    <h3>Accelerator</h3>
    <ul>
      <li><a href="https://crmtogether.com/products/accelerator/" target="_blank" rel="noopener">Accelerator</a></li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
