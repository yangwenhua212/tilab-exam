import { ref } from 'vue';
import * as questionApi from '@/api/question';

export function useQuestion() {
  const loading = ref(false);
  const questions = ref([]);
  const subjects = ref([]);
  const questionTypes = ref([]);

  const fetchQuestions = async (params) => {
    loading.value = true;
    try {
      const res = await questionApi.getQuestions(params);
      questions.value = res.data;
    } finally {
      loading.value = false;
    }
  };

  const fetchSubjects = async () => {
    const res = await questionApi.getSubjects();
    subjects.value = res.data;
  };

  const fetchQuestionTypes = async () => {
    const res = await questionApi.getQuestionTypes();
    questionTypes.value = res.data;
  };

  const addQuestion = async (data) => {
    await questionApi.addQuestion(data);
    await fetchQuestions();
  };

  const deleteQuestion = async (id) => {
    await questionApi.deleteQuestion(id);
    await fetchQuestions();
  };

  const batchDelete = async (ids) => {
    await questionApi.batchDeleteQuestions(ids);
    await fetchQuestions();
  };

  return {
    loading,
    questions,
    subjects,
    questionTypes,
    fetchQuestions,
    fetchSubjects,
    fetchQuestionTypes,
    addQuestion,
    deleteQuestion,
    batchDelete,
  };
}