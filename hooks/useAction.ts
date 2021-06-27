import { AsyncThunk, unwrapResult } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import { useCallback } from 'react';

export const useAsyncAction = <Arg, Returned>(actionCreator: AsyncThunk<Returned, Arg, {}>) => {
  const dispatch = useDispatch<any>();

  return useCallback(
    (arg: Arg) => dispatch(actionCreator(arg))
      .then((result) => unwrapResult(result))
      .catch((err) => Promise.reject(err)),
    [dispatch, actionCreator],
  );
};

// todo: fixed hook
// export const useAsyncAction = <Args extends any[], Action>(
//   actionCreator: (...args: Args) => Action,
// ): ((...args: Args) => Promise<Action>) => {
//   const dispatch = useDispatch<(action: any) => Promise<any>>();
//
//   return useCallback(
//     async (...args: Args) =>
//       dispatch(actionCreator(...args))
//         .then((result) => unwrapResult(result))
//         .catch((err) => Promise.reject(err)),
//     [dispatch],
//   );
// };
