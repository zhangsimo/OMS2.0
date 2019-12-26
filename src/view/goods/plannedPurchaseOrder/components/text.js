export default {
  data() {
    return {
      created() {
        alert(2);
        this.get();
      },
      methods: {
        get() {
          console.log(12121212212);
        }
      }
    };
  },
  props: ["getBrand"]
};
