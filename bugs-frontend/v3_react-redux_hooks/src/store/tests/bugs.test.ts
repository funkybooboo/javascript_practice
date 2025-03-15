import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { loadBugs, addBug, resolveBug, selectUnresolvedBugs } from '../entities/bugs';
import configure_store, { RootState } from "../";
import {Store, UnknownAction} from "redux";

// Triple A's of testing
// - Arrange
// - Act
// - Assert

describe("bugsSlice", () => {
    describe("thunks", () => {
        let fakeAxios: MockAdapter;
        let store: Store;

        beforeEach(() => {
            fakeAxios = new MockAdapter(axios);
            store = configure_store();
        });

        const getBugsSlice = () => store.getState().entities?.bugs;

        describe("add a bug", () => {
            it("should add the bug to the store if it's saved to the server", async () => {
                const bug_id = 1;
                const bug = { description: 'a', project_id: 1 };
                const savedBug = { ...bug, id: bug_id, is_resolved: false };
                fakeAxios.onPost('/bugs').reply(200, savedBug);

                await store.dispatch(addBug(bug));

                const slice = getBugsSlice();
                expect(slice.ids).toHaveLength(1);
                expect(slice.entities[bug_id]).toEqual(savedBug);
            });

            it("should not add the bug to the store if it's not saved to the server", async () => {
                const bug = { description: 'a', project_id: 1 };
                fakeAxios.onPost('/bugs').reply(500);

                await store.dispatch(addBug(bug));

                expect(getBugsSlice().ids).toHaveLength(0);
            });
        });

        describe("resolve a bug", () => {
            it("should mark the bug as resolved if it's saved to the server", async () => {
                console.log(store.getState());
                const bug_id = 1;
                const bug = { description: 'a', project_id: 1 };
                const savedBug = { ...bug, id: bug_id, is_resolved: false };
                fakeAxios.onPost("/bugs").reply(200, savedBug);
                fakeAxios.onPatch(`/bugs/${bug_id}`).reply(200, savedBug);

                await store.dispatch(addBug(bug));
                await store.dispatch(resolveBug(bug_id));

                const slice = getBugsSlice();
                expect(slice.ids).toHaveLength(1);
                expect(slice.entities[bug_id].is_resolved).toBe(true);
            });

            it("should not mark the bug as resolved if it's not saved to the server", async () => {
                console.log(store.getState());
                const bug_id = 1;
                const bug = { description: 'a', project_id: 1 };
                const savedBug = { ...bug, id: bug_id, is_resolved: false };
                fakeAxios.onPost("/bugs").reply(200, savedBug);
                fakeAxios.onPatch(`/bugs/${bug_id}`).reply(500);

                await store.dispatch(addBug(bug));
                await store.dispatch(resolveBug(bug_id));

                const slice = getBugsSlice();
                expect(slice.ids).toHaveLength(1);
                expect(slice.entities[bug_id].is_resolved).not.toBe(true);
            });
        });

        describe("loading bugs", () => {
            describe("if the bugs exist in the cache", () => {
                it('they should not be fetch from the server again', async () => {
                    const bugs = [
                        { id: 1, description: "Bug 1", project_id: 1, is_resolved: true },
                    ];
                    fakeAxios.onGet("/bugs").reply(200, bugs);

                    await store.dispatch(loadBugs() as unknown as UnknownAction);
                    await store.dispatch(loadBugs() as unknown as UnknownAction);

                    expect(fakeAxios.history.get.length).toBe(1);
                });
            });

            describe("if the bugs don't exist in the cache", () => {
                it('they should be fetched from the server and put in the store', async () => {
                    const bugs = [
                        { id: 1, description: "Bug 1", project_id: 1, is_resolved: true },
                    ];
                    fakeAxios.onGet("/bugs").reply(200, bugs);

                    await store.dispatch(loadBugs() as unknown as UnknownAction);

                    expect(getBugsSlice().ids).toHaveLength(1);
                });

                describe("loading indicator", () => {
                    it('should be true while fetching the bugs', () => {
                        const bugs = [
                            { id: 1, description: "Bug 1", project_id: 1, is_resolved: true },
                        ];
                        fakeAxios.onGet("/bugs").reply(() => {
                            expect(getBugsSlice().loading).toBe(true);
                            return [200, bugs];
                        });

                        store.dispatch(loadBugs() as unknown as UnknownAction);
                    });

                    it('should be false after the bugs are fetched', async () => {
                        const bugs = [
                            { id: 1, description: "Bug 1", project_id: 1, is_resolved: true },
                        ];
                        fakeAxios.onGet("/bugs").reply(200, bugs);

                        await store.dispatch(loadBugs() as unknown as UnknownAction);

                        expect(getBugsSlice().loading).toBe(false);
                    });

                    it('should be false if the server returns an error', async () => {
                        const bugs = [
                            { id: 1, description: "Bug 1", project_id: 1, is_resolved: true },
                        ];
                        fakeAxios.onGet("/bugs").reply(500);

                        await store.dispatch(loadBugs() as unknown as UnknownAction);

                        expect(getBugsSlice().loading).toBe(false);
                    });
                });
            });

        });
    });

    describe("selectors", () => {
        const createState = (): RootState => ({
            auth: {
                users: {
                    entities: {},
                    ids: []
                }
            },
            entities: {
                bugs: {
                    entities: {},
                    ids: [],
                    loading: false,
                    lastFetch: null,
                    errorMessage: ""
                },
                projects: {
                    entities: {},
                    ids: []
                }
            }
        });

        describe("select unresolved bugs", () => {
            it("should select the unresolved bugs", () => {
                const fakeState = createState();
                fakeState.entities.bugs.entities = {
                    "1": {id: 1, is_resolved: true, description: 'a', project_id: 1},
                    "2": {id: 2, is_resolved: false, description: 'b', project_id: 1},
                    "3": {id: 3, is_resolved: false, description: 'c', project_id: 1},
                };
                fakeState.entities.bugs.ids = [1, 2, 3];

                const result = selectUnresolvedBugs(fakeState);

                expect(result).toHaveLength(2);
            });
        });
    });
});
