export const status = {
  PENDING: 0,
  DOUGH_PENDING: 1,
  DOUGH_PROGRESS: 2,
  DOUGH_COMPLETED: 3,
  TOPPINGS_PENDING: 4,
  TOPPINGS_PROGRESS: 5,
  TOPPINGS_COMPLETED: 6,
  BAKING_PENDING: 7,
  BAKING_PROGRESS: 8,
  BAKING_COMPLETED: 9,
  SERVING_PENDING: 10,
  SERVING_PROGRESS: 11,
  SERVING_COMPLETED: 12,
  COMPLETED: 13
};

export const abstractStatus = {
  PENDING: 0,
  DOUGH_PENDING: 1,
  DOUGH_PROGRESS: 1,
  DOUGH_COMPLETED: 1,
  TOPPINGS_PENDING: 1,
  TOPPINGS_PROGRESS: 1,
  TOPPINGS_COMPLETED: 1,
  BAKING_PENDING: 1,
  BAKING_PROGRESS: 1,
  BAKING_COMPLETED: 1,
  SERVING_PENDING: 2,
  SERVING_PROGRESS: 2,
  SERVING_COMPLETED: 2,
  COMPLETED: 3
};

export const abstractItem = [
  {
    title: 'Pending',
    description: 'Added to Queue'
  },
  {
    title: 'Preparing',
    description: 'Chef is Preparing.'
  },
  {
    title: 'Prepared',
    description: 'Food on the way'
  },
  {
    title: 'Completed',
    description: 'Food is Served.'
  }
];

export const items = [
  {
    title: 'Pending',
    description: 'Added to Queue'
  },
  {
    title: 'Dough Pending',
    description: 'Dough Chef is busy.'
  },
  {
    title: 'Dough Progress',
    description: 'Preparing Dough'
  },
  {
    title: 'Dough Completed',
    description: 'Preparing Completed'
  },
  {
    title: 'Toppings Pending',
    description: 'Toppings Chef is busy.'
  },
  {
    title: 'Toppings Progress',
    description: 'Preparing Toppings'
  },
  {
    title: 'Toppings Completed',
    description: 'Preparing Completed'
  },
  {
    title: 'Baking Pending',
    description: 'Baking Chef is busy.'
  },
  {
    title: 'Baking Progress',
    description: 'Preparing Baking'
  },
  {
    title: 'Baking Completed',
    description: 'Preparing Completed'
  },
  {
    title: 'Serving Pending',
    description: 'Serving Chef is busy.'
  },
  {
    title: 'Serving Progress',
    description: 'Preparing Serving'
  },
  {
    title: 'Serving Completed',
    description: 'Preparing Completed'
  }
];
