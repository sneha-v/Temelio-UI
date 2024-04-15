import { useState } from 'react';

export default function useMailList(initialValue) {
   const [mailList, updateMailList] = useState(initialValue);

   let current = mailList;

   const get = () => current;

   const set = newValue => {
      current = newValue;
      updateMailList(newValue);
      return current;
   }

   return {
      get,
      set,
   }
}