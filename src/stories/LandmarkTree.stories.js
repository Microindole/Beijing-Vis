// src/stories/LandmarkTree.stories.js
import LandmarkTree from '@/components/LandmarkTree.vue';

export default {
  title: 'Components/LandmarkTree',
  component: LandmarkTree,
  parameters: {
    docs: { 
      description: { 
        component: '北京文化地标生长树可视化组件' 
      } 
    }
  }
};

const Template = (args) => ({
  components: { LandmarkTree },
  setup() {
    return { args };
  },
  template: '<LandmarkTree v-bind="args" />'
});

export const Default = Template.bind({});