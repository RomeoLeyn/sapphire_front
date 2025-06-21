export const getCategory = (category: string | undefined) => {
  switch (category) {
    case "TOOLS":
      return "Інструменти";
    case "HAIR_CARE":
      return "Догляд за волоссям";
    case "NAIL_CARE":
      return "Догляд за нігтями";
    case "SKIN_CARE":
      return "Догляд за шкірою";
    case "OTHER":
      return "Інше";
  }
};

export const getEmployeePosition = (position: string) => {
  switch (position) {
    case "ADMIN":
      return "Адміністратор";
    case "MANAGER":
      return "Менеджер";
    case "TRAINEE":
      return "Стажер";
    case "HAIRDRESSER":
      return "Перукар";
    case "STYLIST":
      return "Стиліст";
    case "COLORIST":
      return "Колорист";
    case "MAKEUP_ARTIST":
      return "Візажист";
    case "MASSEUR":
      return "Масажист";
    case "NAIL_TECHNICIAN":
      return "Майстер манікюру";
    case "COSMETOLOGIST":
      return "Косметолог";
    case "RECEPTIONIST":
      return "Секретар";
    case "CLEANER":
      return "Прибиральник";
  }
};

export const getUnit = (unit: string) => {
  switch (unit) {
    case "ML":
      return "мл";
    case "GR":
      return "гр";
    case "ONES":
      return "шт";
  }
};

export const getEmployeeRole = (role: string) => {
  switch (role) {
    case "ADMIN":
      return "Адміністратор";
    case "EMPLOYEE":
      return "Робітник";
  }
};

export const getEmployeeStatus = (status: string) => {
  switch (status) {
    case "ACTIVE":
      return "Активний";
    case "INACTIVE":
      return "Тимчасово неактивний";
    case "DELETED":
      return "Видалений";
  }
};
