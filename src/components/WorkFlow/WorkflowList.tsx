"use client";
import useIsLogin from "@/hooks/useIsLogin";
import usePopToast from "@/hooks/usePopToast";
import { db } from "@/lib/firebase";
import { Add, DeleteOutline } from "@mui/icons-material";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import LoadingSpinner from "../LoadingSpinner";
type WorkFlowListType = {
  name?: string;
  userId?: string;
  id: string;
  createdAt?: Date;
};

export type NodeType = {
  id: string;
  type: string;
  data: {
    label: string;
    type?: string;
  };
  position: {
    x: number;
    y: number;
  };
};

export type EdgeType = {
  id: string;
  source: string;
  target: string;
  animated: boolean;
};
const initialNodes: NodeType[] = [
  {
    id: "1",
    type: "default",
    data: { label: "START" },
    position: { x: 100, y: 100 }, // 초기 위치
  },
];

const initialEdges: EdgeType[] = [
  {
    id: "edge",
    source: "1",
    target: "2",
    animated: true,
  },
];

const WorkflowList = () => {
  const router = useRouter();
  const { uid, loading } = useIsLogin();
  const [listName, setListName] = useState("");
  const [lists, setLists] = useState<WorkFlowListType[]>([]);
  const { popToast } = usePopToast();

  const addList = async () => {
    if (!uid) {
      return router.push("/");
    }
    try {
      await addDoc(collection(db, "lists"), {
        name: listName,
        userId: uid, // 로그인된 유저의 uid를 리스트에 저장
        createdAt: new Date(),
        Flow: initialNodes,
        Edge: initialEdges,
      });
    } catch (err) {
      console.log("err", err);
    }
  };

  const deleteList = async (id: string) => {
    try {
      const listRef = doc(db, "lists", id);
      await deleteDoc(listRef);
      popToast({ type: "success", title: "리스트를 삭제했습니다!" });
      console.log(`Document with ID: ${id} has been deleted.`);
    } catch (err) {
      popToast({ type: "error", title: `에러 : ${err}` });
      console.log("err", err);
    }
  };

  const getUserLists = useCallback(async () => {
    if (!uid) {
      console.log("User is not logged in");
      return;
    }

    try {
      const q = query(collection(db, "lists"), where("userId", "==", uid));
      const querySnapshot = await getDocs(q);
      const userLists: WorkFlowListType[] = [];
      querySnapshot.forEach((doc) => {
        userLists.push({ id: doc.id, ...doc.data() });
      });
      return userLists;
    } catch (e) {
      console.error("Error getting documents: ", e);
    }
  }, [uid]);

  useEffect(() => {
    getUserLists().then((userLists) => {
      setLists(userLists ?? []);
    });
  }, [getUserLists]);

  return (
    <div>
      {loading ? (
        <LoadingSpinner style="text-blue-500" />
      ) : (
        <div>
          <div className="flex flex-col mb-4 gap-3 text-center">
            {lists.map((list) => (
              <div key={list.id} className="flex justify-between">
                <Link href={`/workflows/${list.id}`}>{list.name}</Link>
                <DeleteOutline
                  className="hover:text-red-500 cursor-pointer"
                  onClick={() => deleteList(list.id)}
                />
              </div>
            ))}
          </div>

          <form className="flex gap-3" onSubmit={addList}>
            <input
              required
              maxLength={24}
              onChange={(e) => setListName(e.target.value)}
              placeholder="리스트 이름을 입력하세요"
              className="border-b-2 border-b-blue-500 px-3"
            />
            <button className="flex btn gap-1" type="submit">
              <Add />
              <p>ADD LIST</p>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default WorkflowList;
