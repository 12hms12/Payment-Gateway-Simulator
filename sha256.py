from hash_util.helper import b2Tob16, preprocessMessage, chunker, initializer
from hash_util.utils import *
from hash_util.constants import *

def sha256(message): 
    k = initializer(K)
    h0, h1, h2, h3, h4, h5, h6, h7 = initializer(h_hex)
    chunks = preprocessMessage(message)

    for chunk in chunks:
        w = chunker(chunk, 32)
        for _ in range(48):
            w.append(32 * [0])
        for i in range(16, 64):
            s0 = XORXOR(rotr(w[i-15], 7), rotr(w[i-15], 18), shr(w[i-15], 3)) 
            s1 = XORXOR(rotr(w[i-2], 17), rotr(w[i-2], 19), shr(w[i-2], 10))
            w[i] = add(add(add(w[i-16], s0), w[i-7]), s1)
        
        a, b, c, d, e, f, g, h = h0, h1, h2, h3, h4, h5, h6, h7

        for j in range(64):
            S1 = XORXOR(rotr(e, 6), rotr(e, 11), rotr(e, 25))
            ch = XOR(AND(e, f), AND(NOT(e), g))
            temp1 = add(add(add(add(h, S1), ch), k[j]), w[j])
            S0 = XORXOR(rotr(a, 2), rotr(a, 13), rotr(a, 22))
            m = XORXOR(AND(a, b), AND(a, c), AND(b, c))
            temp2 = add(S0, m)

            h, g, f, e, d, c, b, a = g, f, e, add(d, temp1), c, b, a, add(temp1, temp2)
        
        h0, h1, h2, h3, h4, h5, h6, h7 = (add(h0, a), add(h1, b), add(h2, c), add(h3, d), add(h4, e), add(h5, f), add(h6, g), add(h7, h))

    digest = ''.join(b2Tob16(val) for val in [h0, h1, h2, h3, h4, h5, h6, h7])
    return digest




# from hash_util.helper import b2Tob16, preprocessMessage, chunker, initializer
# from hash_util.utils import *
# from hash_util.constants import *
# from valid_password import valid_password
# from generate_salt import generate_salt
# from password_rearrange import rearrange_pass_salt

# def sha256(message): 
#     k = initializer(K)
#     h0, h1, h2, h3, h4, h5, h6, h7 = initializer(h_hex)
#     chunks = preprocessMessage(message)
#     #print(f"Preprocessed message chunks: {chunks}")  # Debugging step

#     for chunk in chunks:
#         w = chunker(chunk, 32)
#         for _ in range(48):
#             w.append(32 * [0])
#         for i in range(16, 64):
#             s0 = XORXOR(rotr(w[i-15], 7), rotr(w[i-15], 18), shr(w[i-15], 3)) 
#             s1 = XORXOR(rotr(w[i-2], 17), rotr(w[i-2], 19), shr(w[i-2], 10))
#             w[i] = add(add(add(w[i-16], s0), w[i-7]), s1)
        
#         a = h0
#         b = h1
#         c = h2
#         d = h3
#         e = h4
#         f = h5
#         g = h6
#         h = h7
        
#         for j in range(64):
#             S1 = XORXOR(rotr(e, 6), rotr(e, 11), rotr(e, 25))
#             ch = XOR(AND(e, f), AND(NOT(e), g))
#             temp1 = add(add(add(add(h, S1), ch), k[j]), w[j])
#             S0 = XORXOR(rotr(a, 2), rotr(a, 13), rotr(a, 22))
#             m = XORXOR(AND(a, b), AND(a, c), AND(b, c))
#             temp2 = add(S0, m)

#             # Debug: Print intermediate values
#             #print(f"Round {j}: a={a}, b={b}, c={c}, d={d}, e={e}, f={f}, g={g}, h={h}")

#             h = g
#             g = f
#             f = e
#             e = add(d, temp1)
#             d = c
#             c = b
#             b = a
#             a = add(temp1, temp2)
        
#         h0 = add(h0, a)
#         h1 = add(h1, b)
#         h2 = add(h2, c)
#         h3 = add(h3, d)
#         h4 = add(h4, e)
#         h5 = add(h5, f)
#         h6 = add(h6, g)
#         h7 = add(h7, h)

#     digest = ''
#     for val in [h0, h1, h2, h3, h4, h5, h6, h7]:
#         #print(f"Hash segment before conversion: {val}")  # Debugging step
#         digest += b2Tob16(val)

#     return digest


# #print("Starting SHA-256 hashing process...")

# password = input("Enter Password: ")
# isvalid = valid_password(password)  

# if isvalid: 
#     #print("Valid Password")
#     salt = generate_salt()
#     #print(f"Salt: {salt}")
#     after_mixing = rearrange_pass_salt(password, salt)
#     #print(f"Password after mixing with salt {after_mixing}")
#     hash_val = sha256(after_mixing)
#     #print(f"Final Hash: {hash_val}")
# else:
#     #print("Password must have at least 8 characters, 1 lowercase letter, 1 uppercase letter, 1 digit, and 1 special character")

# #print("Hashing process complete.")
