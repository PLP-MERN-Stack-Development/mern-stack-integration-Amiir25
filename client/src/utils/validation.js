export const validatePost = ({ title, content, category, author }) => {
  const errors = {};
  if (!title) errors.title = 'Title is required';
  if (!content) errors.content = 'Content is required';
  if (!category) errors.category = 'Category is required';
  if (!author) errors.author = 'Author is required';
  return errors;
};
